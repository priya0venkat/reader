import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { Storage } from '@google-cloud/storage'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

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

// OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_key_123'
const CALLBACK_URL = process.env.CALLBACK_URL || 'https://games.verma7.com/auth/google/callback'

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️  GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. OAuth will not work.')
}

// Passport Setup
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID || 'placeholder',
    clientSecret: GOOGLE_CLIENT_SECRET || 'placeholder',
    callbackURL: CALLBACK_URL
},
    (accessToken, refreshToken, profile, done) => {
        // Here you would typically save the user to a database
        // For now, we'll just return the profile
        return done(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// Middleware
app.use(cors({
    origin: true, // Allow all origins for now, or specify 'https://games.verma7.com'
    credentials: true // Important for sessions
}))
app.use(express.json())

// Session Middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS (which we are behind Caddy, but Caddy handles SSL)
        // If behind a proxy like Caddy, we might need app.set('trust proxy', 1)
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

// Trust proxy for secure cookies to work if we set secure: true
app.set('trust proxy', 1)

app.use(passport.initialize())
app.use(passport.session())

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

// --- Auth Routes ---

// Start Login
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/')
    }
)

// Get Current User
app.get('/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                displayName: req.user.displayName,
                photos: req.user.photos,
                emails: req.user.emails
            }
        })
    } else {
        res.status(401).json({ authenticated: false })
    }
})

// Check Auth Status (for internal/proxy use)
app.get('/auth/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendStatus(200)
    } else {
        res.sendStatus(401)
    }
})

// Logout
app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        res.redirect('/')
    })
})


// --- Existing Routes ---

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
    console.log(`🔑 OAuth Status: ${GOOGLE_CLIENT_ID ? 'Enabled' : 'Disabled (Missing Credentials)'}`)
})
