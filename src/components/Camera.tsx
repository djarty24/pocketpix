import React, { useState, useRef } from 'react';
import Screen from './Screen.tsx';
import { Camera as CameraIcon, Play, RefreshCw, Layers } from 'lucide-react';

interface CameraProps {
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const FILTERS = ['', 'sepia(0.8)', 'grayscale(1)', 'saturate(2) contrast(1.2)', 'hue-rotate(90deg)'];

const Camera: React.FC<CameraProps> = ({ setPhotos }) => {
  const [filterIdx, setFilterIdx] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [mode, setMode] = useState<'camera' | 'gallery'>('camera');
  const [flash, setFlash] = useState(false);

  const cycleFilter = () => setFilterIdx((prev) => (prev + 1) % FILTERS.length);
  
  const triggerCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-[600px] drop-shadow-2xl transition-transform hover:scale-[1.01]">
        
        <img 
          src="/camera-frame.png" 
          alt="Pink Digicam" 
          className="relative z-20 pointer-events-none"
        />

        <div 
        className="absolute z-100 top-[26%] left-[14%] w-[51%] h-[52%] overflow-hidden border-2 border-gray-800">
          {mode === 'camera' ? (
            <Screen 
              filter={FILTERS[filterIdx]} 
              isMirrored={!isMirrored} 
              onCapture={(img) => setPhotos(prev => [img, ...prev])}
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white font-mono text-xs">
              [GALLERY ACTIVE]
            </div>
          )}
          
          {flash && <div className="absolute inset-0 bg-white z-50 animate-pulse" />}
        </div>

        <button 
          onClick={triggerCapture}
          className="absolute z-30 top-[5%] right-[25%] w-12 h-12 rounded-full cursor-pointer active:translate-y-1 transition-all"
          title="Shutter"
        />

        <div className="absolute z-30 bottom-[15%] right-[8%] flex flex-col gap-2">
          <button onClick={() => setMode(mode === 'camera' ? 'gallery' : 'camera')} className="p-2 bg-zinc-200 rounded-full shadow-inner active:scale-95">
             <Play size={16} fill={mode === 'gallery' ? 'black' : 'none'} />
          </button>
          <button onClick={cycleFilter} className="p-2 bg-zinc-200 rounded-full shadow-inner active:scale-95">
             <Layers size={16} />
          </button>
          <button onClick={() => setIsMirrored(!isMirrored)} className="p-2 bg-zinc-200 rounded-full shadow-inner active:scale-95">
             <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Camera;