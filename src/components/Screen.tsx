import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface ScreenProps {
	filter: string;
	isMirrored: boolean;
	onCapture: (photo: { displayUrl: string; exportUrl: string, dateStr: string, timeStr: string }) => void;
}

export interface ScreenHandle {
	capture: () => void;
}

const Screen = forwardRef<ScreenHandle, ScreenProps>(({ filter, isMirrored, onCapture }, ref) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		let stream: MediaStream | null = null;
		async function startCamera() {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err) {
				console.error("Camera access denied:", err);
			}
		}
		startCamera();
		return () => stream?.getTracks().forEach(track => track.stop());
	}, []);

	useImperativeHandle(ref, () => ({
		capture: () => {
			if (!videoRef.current) return;

			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;

			if (canvas.width === 0 || canvas.height === 0) return;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.filter = filter;
				if (isMirrored) {
					ctx.translate(canvas.width, 0);
					ctx.scale(-1, 1);
				}

				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

				const displayUrl = canvas.toDataURL('image/jpeg', 0.9);

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				const now = new Date();
				const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;
				const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

				ctx.fillStyle = '#ff8c00';
				ctx.font = `bold ${Math.floor(canvas.height * 0.045)}px "Courier New", monospace`;
				ctx.textAlign = 'right';
				ctx.textBaseline = 'bottom';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
				ctx.shadowBlur = 4;
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;

				const paddingX = canvas.width * 0.05;
				const paddingY = canvas.height * 0.05;
				ctx.fillText(`${dateStr} ${timeStr}`, canvas.width - paddingX, canvas.height - paddingY);

				const exportUrl = canvas.toDataURL('image/jpeg', 0.9);

				onCapture({ displayUrl, exportUrl, dateStr, timeStr });
			}
		}
	}), [filter, isMirrored, onCapture]);

	return (
		<div className="relative w-full h-full bg-black">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className="w-full h-full object-cover transition-all duration-300"
				style={{ filter: filter, transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
			/>
			<div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between font-mono">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-1.5 bg-black/20 px-1 rounded">
						<div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-[pulse_1s_infinite]" />
						<span className="text-digital-orange text-[10px] font-bold">REC</span>
					</div>
					<span className="text-digital-orange text-[10px] bg-black/20 px-1 rounded">100% [|||]</span>
				</div>
				<div className="flex justify-between items-end">
					<div className="text-digital-orange text-[10px] leading-tight drop-shadow-md bg-black/20 px-1 rounded">
						F2.8 <br /> ISO 100
					</div>
					<div className="text-right text-digital-orange text-xs sm:text-sm drop-shadow-md bg-black/20 px-1 rounded">
						01/16/04 <br /> 12:04 PM
					</div>
				</div>
			</div>
		</div>
	);
});

Screen.displayName = "Screen";
export default Screen;