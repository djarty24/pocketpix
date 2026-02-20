import React, { useState, useRef, useEffect, useCallback } from 'react';
import Screen, { type ScreenHandle } from './Screen';
import JSZip from 'jszip';

interface PhotoData {
    displayUrl: string;
    exportUrl: string;
    dateStr: string;
    timeStr: string;
}

interface CameraProps {
    photos: PhotoData[];
    setPhotos: React.Dispatch<React.SetStateAction<PhotoData[]>>;
}

const FILTERS = ['', 'sepia(0.8)', 'grayscale(1)', 'saturate(2) contrast(1.2)', 'blur(0.5px) contrast(1.1)'];

const Camera: React.FC<CameraProps> = ({ photos, setPhotos }) => {
    const screenRef = useRef<ScreenHandle>(null);

    const [filterIdx, setFilterIdx] = useState(0);
    const [isMirrored, setIsMirrored] = useState(false);
    const [flash, setFlash] = useState(false);

    type AppMode = 'camera' | 'gallery_single' | 'gallery_grid' | 'menu' | 'select_photobooth' | 'select_zip';
    const [mode, setMode] = useState<AppMode>('camera');

    const [galleryIndex, setGalleryIndex] = useState(0);
    const [menuIndex, setMenuIndex] = useState(0);
    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

    const cycleFilter = () => setFilterIdx((prev) => (prev + 1) % FILTERS.length);
    const toggleGallery = () => setMode(prev => prev === 'camera' ? 'gallery_single' : 'camera');

    const triggerCapture = useCallback(() => {
        if (mode !== 'camera') return;
        setFlash(true);
        screenRef.current?.capture();
        setTimeout(() => setFlash(false), 150);
    }, [mode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                triggerCapture();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [triggerCapture]);

    const handleUp = () => {
        if (mode === 'camera') setIsMirrored(!isMirrored);
        if (mode === 'menu') setMenuIndex(prev => Math.max(0, prev - 1));
        if (mode === 'gallery_grid' || mode.startsWith('select_')) setGalleryIndex(prev => Math.max(0, prev - 3));
    };

    const handleDown = () => {
        if (mode === 'menu') setMenuIndex(prev => Math.min(3, prev + 1));
        if (mode === 'gallery_grid' || mode.startsWith('select_')) setGalleryIndex(prev => Math.min(photos.length - 1, prev + 3));
    };

    const handleLeft = () => {
        if (['gallery_single', 'gallery_grid', 'select_photobooth', 'select_zip'].includes(mode)) {
            setGalleryIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleRight = () => {
        if (['gallery_single', 'gallery_grid', 'select_photobooth', 'select_zip'].includes(mode)) {
            setGalleryIndex(prev => Math.min(photos.length - 1, prev + 1));
        }
    };

    const exportPhotobooth = async (indices: number[]) => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 1800;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });

        for (let i = 0; i < 4; i++) {
            const photo = photos[indices[i]];

            const img = await loadImg(photo.displayUrl);

            const targetW = 560;
            const targetH = 420;
            const imgRatio = img.width / img.height;
            const targetRatio = targetW / targetH;
            let sourceX = 0, sourceY = 0, sourceW = img.width, sourceH = img.height;

            if (imgRatio > targetRatio) {
                sourceW = img.height * targetRatio;
                sourceX = (img.width - sourceW) / 2;
            } else {
                sourceH = img.width / targetRatio;
                sourceY = (img.height - sourceH) / 2;
            }

            const drawY = 20 + (i * 440);

            ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 20, drawY, targetW, targetH);

            ctx.fillStyle = '#ff8c00';
            ctx.font = 'bold 22px "Courier New", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillText(`${photo.dateStr} ${photo.timeStr}`, 20 + targetW - 15, drawY + targetH - 15);
        }

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = 'pocketpix-strip.jpg';
        link.click();

        setMode('menu');
        setSelectedPhotos([]);
    };

    const exportZip = async () => {
        if (selectedPhotos.length === 0) return;
        const zip = new JSZip();
        selectedPhotos.forEach((index) => {
            const dataUrl = photos[index].exportUrl;
            const base64Data = dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
            zip.file(`PocketPix_IMG_${1000 + index}.jpg`, base64Data, { base64: true });
        });
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'PocketPix_Export.zip';
        link.click();
        URL.revokeObjectURL(url);

        setMode('menu');
        setSelectedPhotos([]);
    };

    const handleCenterOK = () => {
        if (mode === 'gallery_grid') {
            setMode('gallery_single');
        } else if (mode === 'select_photobooth') {
            if (selectedPhotos.includes(galleryIndex)) {
                setSelectedPhotos(prev => prev.filter(i => i !== galleryIndex));
            } else if (selectedPhotos.length < 4) {
                const newSel = [...selectedPhotos, galleryIndex];
                setSelectedPhotos(newSel);
                if (newSel.length === 4) exportPhotobooth(newSel);
            }
        } else if (mode === 'select_zip') {
            if (selectedPhotos.includes(galleryIndex)) setSelectedPhotos(prev => prev.filter(i => i !== galleryIndex));
            else setSelectedPhotos(prev => [...prev, galleryIndex]);
        } else if (mode === 'menu') {
            switch (menuIndex) {
                case 0:
                    if (photos.length >= 4) { setMode('select_photobooth'); setSelectedPhotos([]); setGalleryIndex(0); }
                    else alert("Take at least 4 photos first!");
                    break;
                case 1:
                    if (photos.length > 0) { setMode('select_zip'); setSelectedPhotos([]); setGalleryIndex(0); }
                    break;
                case 2:
                    if (confirm("Delete all photos?")) { setPhotos([]); setMode('camera'); }
                    break;
                case 3:
                    setMode('camera');
                    break;
            }
        }
    };

    const handleMenuButton = () => {
        if (mode === 'select_zip' && selectedPhotos.length > 0) exportZip();
        else if (mode.startsWith('select_')) setMode('menu');
        else setMode(mode === 'menu' ? 'camera' : 'menu');
    };

    return (
        <div className="relative w-full max-w-[700px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] select-none mx-auto">

            <img src="/camera-frame.png" alt="Pink Sony Digicam" className="relative z-20 pointer-events-none w-full h-auto" />

            <div className="absolute z-10 overflow-hidden bg-black border-2 border-gray-900 shadow-[inset_0_0_10px_rgba(0,0,0,1)] text-white font-mono"
                style={{ top: '26%', left: '14%', width: '51%', height: '52%' }}>

                {mode === 'camera' && (
                    <Screen ref={screenRef} filter={FILTERS[filterIdx]} isMirrored={!isMirrored} onCapture={(photoData) => setPhotos(prev => [photoData, ...prev])} />
                )}

                {mode === 'gallery_single' && (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative">
                        {photos.length === 0 ? (
                            <span className="text-digital-orange text-xs">NO IMAGES</span>
                        ) : (
                            <>
                                <img src={photos[galleryIndex].displayUrl} className="w-full h-full object-cover" alt="Saved" />
                                <div className="absolute top-2 right-2 bg-black/50 text-digital-orange text-[10px] px-1 rounded shadow">{galleryIndex + 1}/{photos.length}</div>
                            </>
                        )}
                    </div>
                )}

                {(mode === 'gallery_grid' || mode.startsWith('select_')) && (
                    <div className="w-full h-full bg-zinc-800 p-2 relative">
                        <div className="grid grid-cols-3 gap-1 overflow-y-auto h-full pb-8">
                            {photos.map((p, i) => (
                                <div key={i} className={`relative aspect-square bg-black border-2 ${galleryIndex === i ? 'border-yellow-400 z-10 scale-105' : 'border-transparent'}`}>
                                    <img src={p.displayUrl} className="w-full h-full object-cover opacity-90" alt={`Grid ${i}`} />
                                    {mode.startsWith('select_') && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            {selectedPhotos.includes(i) && (
                                                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-[10px] border border-black shadow">
                                                    {mode === 'select_photobooth' ? selectedPhotos.indexOf(i) + 1 : '✓'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {mode === 'select_photobooth' && (
                            <div className="absolute bottom-0 left-0 w-full bg-blue-900/90 text-center text-[10px] py-1 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
                                SELECT {selectedPhotos.length}/4
                            </div>
                        )}
                        {mode === 'select_zip' && (
                            <div className="absolute bottom-0 left-0 w-full bg-blue-900/90 text-center text-[10px] py-1 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] animate-pulse">
                                PRESS MENU TO EXPORT ({selectedPhotos.length})
                            </div>
                        )}
                    </div>
                )}

                {mode === 'menu' && (
                    <div className="w-full h-full bg-blue-900/90 p-4 flex flex-col justify-center border-l-8 border-gray-400">
                        <h2 className="text-yellow-400 text-xs mb-4 font-bold tracking-widest uppercase shadow-sm">Memory Stick</h2>
                        <ul className="space-y-3 text-[10px] uppercase">
                            <li className={menuIndex === 0 ? 'bg-yellow-400 text-black px-2' : 'px-2'}>1. Photobooth (Select 4)</li>
                            <li className={menuIndex === 1 ? 'bg-yellow-400 text-black px-2' : 'px-2'}>2. Select & Export (ZIP)</li>
                            <li className={menuIndex === 2 ? 'bg-yellow-400 text-black px-2' : 'px-2'}>3. Delete All Photos</li>
                            <li className={menuIndex === 3 ? 'bg-yellow-400 text-black px-2' : 'px-2'}>4. Exit Menu</li>
                        </ul>
                    </div>
                )}

                {flash && <div className="absolute inset-0 bg-white z-[100]" />}
            </div>

            <button onClick={() => { if (photos.length > 0) setMode('gallery_grid'); }} className="absolute z-30 cursor-pointer rounded-sm border-2 border-pink-400 bg-pink-400/40" style={{ top: '23%', left: '76%', width: '5%', height: '5%' }} title="W - Zoom Out" />
            <button onClick={toggleGallery} className="absolute z-30 cursor-pointer rounded-sm border-2 border-pink-400 bg-pink-400/40" style={{ top: '52%', left: '73%', width: '4%', height: '5%' }} title="Play/Gallery" />
            <button onClick={cycleFilter} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '32%', left: '73%', width: '14%', height: '19%' }} title="Mode Dial (Change Filter)" />
            <button onClick={handleUp} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '58%', left: '77%', width: '7%', height: '5%' }} title="Up" />
            <button onClick={handleDown} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '70%', left: '78%', width: '5%', height: '5%' }} title="Down" />
            <button onClick={handleLeft} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '63%', left: '74%', width: '4%', height: '7%' }} title="Previous" />
            <button onClick={handleRight} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '63%', left: '83%', width: '4%', height: '7%' }} title="Next" />
            <button onClick={handleCenterOK} className="absolute z-30 cursor-pointer rounded-full border-2 border-yellow-400 bg-yellow-400/40" style={{ top: '64%', left: '78.5%', width: '4%', height: '5%' }} title="OK / Select" />
            <button onClick={handleMenuButton} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '75%', left: '73%', width: '4%', height: '7%' }} title="MENU" />
            <button onClick={() => setMode('camera')} className="absolute z-30 cursor-pointer rounded-full border-2 border-pink-400 bg-pink-400/40" style={{ top: '75%', left: '83%', width: '4%', height: '7%' }} title="HOME" />
        </div>
    );
};

export default Camera;