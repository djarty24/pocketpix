import React, { useState } from 'react';
import Camera from './components/Camera';
import Gallery from './components/Gallery';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <main className="min-h-screen w-full relative">
      <div className="film-grain" />
      
      <Camera photos={photos} setPhotos={setPhotos} />

      {/* Optional: Floating Gallery Drawer */}
      {photos.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40">
           <Gallery photos={photos} />
        </div>
      )}
    </main>
  );
};

export default App;