import React from 'react';

interface GalleryProps {
  photos: string[];
}

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 max-w-full">
      {photos.map((photo, index) => (
        <div 
          key={index} 
          className="flex-shrink-0 bg-white p-2 pb-6 shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-32 sm:w-40 border border-gray-100"
        >
          <div className="aspect-square bg-zinc-200 overflow-hidden">
            <img src={photo} alt={`Capture ${index}`} className="w-full h-full object-cover" />
          </div>
          <p className="mt-2 text-[10px] font-mono text-gray-400 text-center">
            IMG_{1000 + index}.JPG
          </p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;