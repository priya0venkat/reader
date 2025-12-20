import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

// Initialize Google Cloud Storage
const storage = new Storage()
const bucketName = 'purejax-data-1234'
const bucket = storage.bucket(bucketName)
const uploadPath = 'puzzle-game/user-uploads/'

// Default images
const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80',
    'https://storage.googleapis.com/purejax-data-1234/puzzle-game/Kitkat.png',
    'https://storage.googleapis.com/purejax-data-1234/puzzle-game/bourbon.png',
]

// Middleware
app.use(cors())
app.use(express.json())

// Configure multer for memory storage (we'll upload directly to GCS)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)

        if (extname && mimetype) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
        }
    }
})

// GET /api/images - List all available images
app.get('/api/images', async (req, res) => {
    try {
        // Get uploaded images from GCS
        const [files] = await bucket.getFiles({ prefix: uploadPath })

        const uploadedImages = files
            .filter(file => file.name !== uploadPath) // Exclude the directory itself
            .map(file => `https://storage.googleapis.com/${bucketName}/${file.name}`)

        // Combine default images with uploaded ones
        const allImages = [...DEFAULT_IMAGES, ...uploadedImages]

        res.json({ images: allImages })
    } catch (error) {
        console.error('Error listing images:', error)
        res.status(500).json({ error: 'Failed to list images', message: error.message })
    }
})

// POST /api/upload - Upload image to GCS
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const originalName = req.file.originalname
        const extension = path.extname(originalName)
        const filename = `${timestamp}${extension}`
        const gcsPath = `${uploadPath}${filename}`

        // Upload to GCS
        const blob = bucket.file(gcsPath)
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: req.file.mimetype,
            },
        })

        blobStream.on('error', (error) => {
            console.error('Error uploading to GCS:', error)
            res.status(500).json({ error: 'Failed to upload to cloud storage', message: error.message })
        })

        blobStream.on('finish', async () => {
            // Make the file publicly accessible
            await blob.makePublic()

            // Generate public URL
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsPath}`

            res.json({
                success: true,
                url: publicUrl,
                filename: filename
            })
        })

        // Write the buffer to GCS
        blobStream.end(req.file.buffer)

    } catch (error) {
        console.error('Error in upload endpoint:', error)
        res.status(500).json({ error: 'Upload failed', message: error.message })
    }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err)
    res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`🚀 Puzzle game backend server running on http://localhost:${PORT}`)
    console.log(`📦 Using GCS bucket: ${bucketName}`)
    console.log(`📁 Upload path: ${uploadPath}`)
})
