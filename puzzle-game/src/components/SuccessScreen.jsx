import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

export default function SuccessScreen({ onReset, image }) {
    useEffect(() => {
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']
            })
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-8 gap-10 text-center h-full w-full bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
                <h1 className="relative text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 drop-shadow-sm mb-2">
                    Puzzle Solved!
                </h1>
                <p className="text-white/80 text-xl font-medium tracking-widest uppercase">Spectacular Performance</p>
            </motion.div>

            <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/20 backdrop-blur-xl p-2 max-w-4xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <img src={image} alt="Completed Puzzle" className="max-h-[50vh] object-contain rounded-lg" />
            </motion.div>

            <motion.button
                onClick={onReset}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.4 }}
                className="px-10 py-4 bg-white text-violet-900 rounded-full font-black text-xl hover:bg-violet-50 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Play Again
            </motion.button>
        </div>
    )
}
