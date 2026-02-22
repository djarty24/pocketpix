import React, { useState, useRef, useEffect } from 'react';
import Camera from './components/Camera';

const App: React.FC = () => {
    const [photos, setPhotos] = useState<{ displayUrl: string, exportUrl: string, dateStr: string, timeStr: string }[]>([]);
    const [showHelp, setShowHelp] = useState(false);

    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/bgm.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        
        if (isMusicPlaying) {
            audioRef.current.pause();
            setIsMusicPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
            setIsMusicPlaying(true);
        }
    };

    return (
        <main className="h-[100dvh] w-full relative flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
            <div className="film-grain" />

            <button 
                onClick={toggleMusic}
                className="absolute top-4 right-4 z-50 bg-white/70 hover:bg-white/90 border-2 border-dashed border-pink-400 text-pink-600 px-3 py-1 rounded-full shadow-[2px_2px_0_rgba(255,105,180,0.4)] backdrop-blur-sm cursor-pointer transition-transform active:scale-95 text-xs sm:text-sm font-bold flex items-center gap-2"
                style={{ fontFamily: '"Varela Round", sans-serif' }}
            >
                <span>{isMusicPlaying ? '💿 playing' : '⏸️ paused'}</span>
                {isMusicPlaying && <span className="animate-spin text-lg leading-none">✨</span>}
            </button>

            <div className="select-none text-center z-40 mt-2 shrink-0">

                <img
                    src="/logo.png"
                    draggable={false}
                    alt="PocketPix Logo"
                    className="h-20 sm:h-32 mx-auto mb-3 object-contain drop-shadow-[3px_3px_0_#ff1493] hover:scale-105 transition-transform cursor-pointer"
                />

                <p
                    className="text-pink-900 text-[10px] sm:text-sm bg-white/60 px-5 py-2 rounded-full border-2 border-dashed border-pink-400 backdrop-blur-md shadow-[4px_4px_0_rgba(255,105,180,0.3)] max-w-[90vw] mx-auto font-bold"
                    style={{ fontFamily: '"Varela Round", sans-serif' }}
                >
                    a cozy, 2000s digicam for late-night sleepovers ✧˖°
                </p>
            </div>

            <div className="flex-1 w-full flex items-center justify-center z-30 min-h-0">
                <Camera photos={photos} setPhotos={setPhotos} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 z-40 shrink-0 font-bold" style={{ fontFamily: '"Varela Round", sans-serif' }}>
                <div className="text-center text-xs text-pink-900 bg-white/70 px-5 py-2.5 rounded-full border-2 border-pink-400 animate-pulse shadow-[4px_4px_0_rgba(255,105,180,0.4)] backdrop-blur-sm flex items-center justify-center">
                    Press space to snap a pic!
                </div>
                <button
                    onClick={() => setShowHelp(true)}
                    className="text-center text-xs text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 px-6 py-2.5 rounded-full border-2 border-white shadow-[4px_4px_0_rgba(255,105,180,0.5)] backdrop-blur-sm transition-all active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center tracking-wider"
                >
                    User manual!
                </button>
            </div>

            {showHelp && (
                <div className="fixed inset-0 bg-sky-300/40 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
                    <div
                        className="bg-white/95 border-4 border-dashed border-sky-400 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[10px_10px_0_rgba(66,152,245,0.4)] relative text-blue-900"
                        style={{ fontFamily: '"Varela Round", sans-serif' }}
                    >

                        <button
                            onClick={() => setShowHelp(false)}
                            className="absolute -top-4 -right-4 bg-pink-500 hover:bg-pink-400 text-white border-4 border-white rounded-full w-12 h-12 flex items-center justify-center font-black text-2xl shadow-lg cursor-pointer transform hover:scale-110 transition-all"
                        >
                            ×
                        </button>

                        <h2
                            className="text-center text-4xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-sm tracking-wide"
                            style={{ fontFamily: '"Chewy", cursive' }}
                        >
                            User Manual
                        </h2>

                        <div className="space-y-4 text-sm font-medium">
                            <p className="flex items-start gap-3"><span className="text-xl">📸</span> <span><strong className="text-pink-600 uppercase tracking-wide">Spacebar:</strong> Snap a pic!</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">▶️</span> <span><strong className="text-pink-600 uppercase tracking-wide">Play Button:</strong> Swap between Camera Mode & Gallery Mode.</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">💿</span> <span><strong className="text-pink-600 uppercase tracking-wide">Silver Dial:</strong> Cycle through different filters.</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">🔍</span> <span><strong className="text-pink-600 uppercase tracking-wide">W Button:</strong> Zoom out to your photo grid.</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">🕹️</span> <span><strong className="text-pink-600 uppercase tracking-wide">D-Pad Arrows:</strong> Click through your photos.</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">🔘</span> <span><strong className="text-pink-600 uppercase tracking-wide">Center Dot (OK):</strong> Open a pic from the grid.</span></p>
                            <p className="flex items-start gap-3"><span className="text-xl">💾</span> <span><strong className="text-pink-600 uppercase tracking-wide">Menu:</strong> Export your photos as a ZIP or Photobooth strip!</span></p>
                        </div>

                        <button
                            onClick={() => setShowHelp(false)}
                            className="mt-8 w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white text-xl py-3 rounded-xl shadow-[4px_4px_0_rgba(255,105,180,0.3)] cursor-pointer active:translate-y-1 active:shadow-none transition-all tracking-wide border-2 border-white"
                            style={{ fontFamily: '"Chewy", cursive' }}
                        >
                            GOT IT! 🦋
                        </button>

                    </div>
                </div>
            )}
        </main>
    );
};

export default App;