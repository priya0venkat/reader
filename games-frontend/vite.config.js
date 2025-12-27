import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['apple-touch-icon.png', 'piper/**/*', 'onnx/**/*', 'games/**/*'],
            manifest: {
                name: 'Verma Games',
                short_name: 'Games',
                description: 'Educational games for kids - Alphabet Fishing, Flash Cards, Puzzles, and more!',
                theme_color: '#2a9d8f',
                background_color: '#1a1a2e',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: 'apple-touch-icon.png',
                        sizes: '180x180',
                        type: 'image/png'
                    },
                    {
                        src: 'apple-touch-icon.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'apple-touch-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                // Allow large files (ONNX workers, WASM) to be precached
                maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB
                // Exclude auth routes from service worker navigation fallback
                navigateFallbackDenylist: [/^\/auth/],
                // Cache all static assets
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot,json,onnx,wav}'],
                // Runtime caching for dynamic requests
                runtimeCaching: [
                    {
                        // Cache ONNX and Piper model files (large, rarely change)
                        urlPattern: /\.(onnx|bin|data)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'model-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        // Cache images
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        // Cache fonts
                        urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'font-cache',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        // API calls - network first with fallback
                        urlPattern: /\/api\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            networkTimeoutSeconds: 10,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            }
                        }
                    }
                ]
            }
        })
    ],
    base: './',
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'credentialless',
        },
        proxy: {
            '/api': 'http://localhost:3002',
            '/auth': 'http://localhost:3001'
        }
    },
})
