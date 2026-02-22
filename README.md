<div align="center">
  <img src="public/logo.png" alt="PocketPix Logo" width="350" />
  
  *A cozy, 2000s digicam for capturing memories*
</div>

---

## What is PocketPix?
PocketPix turns your browser into a classic 2000s Sony Cyber-shot digital camera.

## Features
* **Shutter & Timer:** A hardwired 3-second self-timer with pulsing on-screen digits, culminating in a bright flash and a crunchy mechanical shutter sound.
* **Exports:** Open the digital menu to format your drive, export a massive `.zip` file of all your memories, or print a classic 4-photo photobooth strip.
* **Photobooth Strips:** Crops your webcam photos into nostalgic 4:3 polaroids, and adds timestamps to the corner of each frame.
* **Vintage Filters:** Cycle through Y2K-inspired color filters (Sepia, Grayscale, High-Contrast Saturate, and Dreamy Blur) using the silver Mode Dial.
* **2000s Soundscape:** Complete with tactile menu beeps, timer ticks, and a built-in music player to loop your favorite hip hop background tracks.
* **Realistic Navigation:** Use the W/T rocker to zoom out to a multi-photo grid, and click through your gallery using the D-Pad, just like using a real Sony Cyber-shot digicam.

## How to Use
1. Click the **Play/Gallery** button to toggle between the Live View and the Gallery View, which contains your saved photos.
2. Press the **Spacebar** to trigger the 3-second countdown and snap a pic.
3. Use the **W Button** in the gallery to zoom out to the 3x3 photo grid.
4. Press the **Menu** button to access the Memory Stick and export your photobooth strips!

## Tech Stack
* **Framework:** React & TypeScript
* **Styling:** Tailwind CSS v4
* **Core Logic:** HTML5 `<canvas>` for image manipulation, cropping, and text-rendering.
* **File Handling:** `jszip` for bulk photo exports.

## Running Locally
Want to boot up the camera on your own machine?

```bash
# Install the dependencies
npm install

# Start the Vite development server
npm run dev
```

## Credits & Attributions
A huge thank you to the talented creators on [Pixabay](https://pixabay.com/) for the audio that brings this digital camera to life!
* **Sound Effects:** Menu UI beeps, timer ticks, and the mechanical camera shutter were all sourced from Pixabay's SFX library
    * Button Press: [*Charming Twinkle Sound for Fantasy and Magic*](https://pixabay.com/sound-effects/film-special-effects-charming-twinkle-sound-for-fantasy-and-magic-250240/) by Universfield
    * Timer Tick: [*Bubble Pop 02*](https://pixabay.com/sound-effects/film-special-effects-bubble-pop-02-293341/) by Universfield
    * Camera Shutter: [*Camera Shutter*](https://pixabay.com/sound-effects/technology-camera-shutter-6305/) by freesound_community
* **Background Music:** [*2000s HipHop Beat*](https://pixabay.com/music/beats-2000s-hiphop-beat-346201/) by RoChick

---
<div align="center">

### This project was built for Hack Club's Sleepover event.
</div>