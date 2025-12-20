import { useState } from 'react'

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80', // Lion
    'https://storage.googleapis.com/purejax-data-1234/puzzle-game/Kitkat.png', // KitKat
    'https://storage.googleapis.com/purejax-data-1234/puzzle-game/bourbon.png', // Bourbon
]

export default function Menu({ onStart }) {
    const [selectedImage, setSelectedImage] = useState(DEFAULT_IMAGES[0])
    const [difficulty, setDifficulty] = useState(3)

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setSelectedImage(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="flex flex-col items-center gap-10 p-8 w-full h-full overflow-y-auto z-10">
            <div className="text-center space-y-2">
                <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                    Puzzle Snap
                </h1>
                <p className="text-gray-300 text-lg font-light tracking-wide">Unleash your inner puzzle master</p>
            </div>

            <div className="flex flex-col gap-6 w-full max-w-2xl bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="space-y-4">
                    <label className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-sm">1</span>
                        Choose an Image
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {DEFAULT_IMAGES.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`group relative rounded-2xl overflow-hidden aspect-square border-4 transition-all duration-300 ${selectedImage === img
                                    ? 'border-pink-500 scale-105 shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                    }`}
                            >
                                <img src={img} alt={`Puzzle ${idx}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                        <label className="relative flex items-center justify-center w-full px-6 py-4 bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors border border-white/10">
                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Upload Custom Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Custom Image Preview */}
                    {!DEFAULT_IMAGES.includes(selectedImage) && (
                        <div className="mt-4 flex flex-col items-center animate-pulse">
                            <div className="relative rounded-2xl overflow-hidden aspect-video w-full border-2 border-pink-500 shadow-lg">
                                <img src={selectedImage} alt="Custom Selection" className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md">
                                    READY
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">2</span>
                        Select Difficulty <span className="text-violet-300 font-normal">({difficulty}x{difficulty})</span>
                    </label>

                    <div className="relative pt-6 pb-2">
                        <input
                            type="range"
                            min="2"
                            max="6"
                            value={difficulty}
                            onChange={(e) => setDifficulty(Number(e.target.value))}
                            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium mt-2 uppercase tracking-wider">
                            <span>Easy Peasy</span>
                            <span>Brain Teaser</span>
                            <span>Impossible</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onStart(selectedImage, difficulty)}
                    className="mt-4 w-full py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl font-black text-2xl text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                    Start Game
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>

            <p className="text-slate-500 text-sm font-medium">v1.0 • Designed for Puzzlers</p>
        </div>
    )
}
