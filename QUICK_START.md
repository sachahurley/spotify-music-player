# 🚀 Quick Start - Test Your Animation NOW!

## ✅ Everything is Ready!

Your GSAP animation system is fully set up and ready to test. Here's what to do:

---

## 📋 Test It Right Now (2 minutes)

### Step 1: Start the Server
```bash
cd /Users/sachahurley/spotify-music-player
npm run dev
```

### Step 2: Open Your Browser
Navigate to: **http://localhost:3000**

### Step 3: Go to Dream Song
- Click on "Dream Song" by Jeff Kolhede in the song list
- You should see the player page with the album cover

### Step 4: Watch the Animation
- **Press the PLAY button** ▶️
- Watch the album cover animate!
- It will loop every 7 seconds

### Step 5: Hide UI for Recording
- **Click the EYE ICON** 👁️ (at the bottom center)
- All UI disappears
- Only the animated album cover remains
- Perfect for recording your Spotify Canvas!

---

## 🎨 Current Animation (7 seconds):

- **0-2s:** Gentle zoom in + slight rotation
- **2-4s:** Brightness pulse + tiny extra zoom
- **4-7s:** Smooth return to start → loops

---

## 🛠️ Want to Customize?

**File to Edit:**  
`components/AnimatedAlbumCover.tsx`

**Look for this section (around line 60):**
```typescript
// SCENE 1: Gentle Zoom & Rotate (0s → 2s)
timeline.to(img, {
  scale: 1.1,          // ← Change zoom amount
  rotation: 3,         // ← Change rotation degrees
  duration: 2,         // ← Change how long it takes
  ease: 'power1.inOut'
}, 0);
```

**Try changing:**
- `scale: 1.2` for more zoom
- `rotation: 10` for more rotation
- `duration: 3` for slower movement

Save the file and the browser will auto-refresh!

---

## 📹 Record for Spotify Canvas

### Using Screen Studio (You already have this!)

1. **Prepare:**
   - Hide UI with eye icon 👁️
   - Press play to start animation
   - Let it loop once to warm up

2. **Record:**
   - Set Screen Studio to **9:16 vertical format**
   - Frame only the album cover area
   - Record for 7-8 seconds (one full loop)

3. **Export:**
   - Trim to exactly 7 seconds
   - Export as MP4
   - Resolution: 1080x1920 recommended
   - Upload to Spotify for Artists!

---

## ✨ What Files Were Created:

1. **`components/AnimatedAlbumCover.tsx`**  
   → The animated component with GSAP timeline
   
2. **`app/player/[id]/page.tsx`**  
   → Updated to use the animated component
   
3. **`ANIMATION_GUIDE.md`**  
   → Full documentation and tutorials
   
4. **`QUICK_START.md`**  
   → This file!

---

## 🆘 If Something's Wrong:

### "Animation not showing"
- Make sure you're on Dream Song (song-2)
- Press the play button
- Check browser console (F12) for errors

### "Page won't load"
- Run `npm install` first
- Then `npm run dev`

### "GSAP errors"
- GSAP should be installed
- If not: `npm install gsap`

---

## 💡 Pro Tip for Spotify Canvas:

**Spotify Canvas specs:**
- **Format:** MP4 (H.264)
- **Aspect Ratio:** 9:16 (vertical - like Instagram Stories)
- **Duration:** 3-8 seconds (your 7s is perfect!)
- **Size:** Under 10MB
- **Resolution:** 720x1280 minimum, 1080x1920 recommended

Your animation loops seamlessly, so recording one 7-second loop gives you the perfect Canvas video!

---

## 🎯 Next Steps:

1. **Test** → Run dev server and view animation
2. **Customize** → Edit AnimatedAlbumCover.tsx to your liking
3. **Record** → Use Screen Studio to capture
4. **Upload** → Send to Spotify for Artists
5. **Share** → Show me how it looks! 😊

---

**Ready? Run `npm run dev` and let's see it!** 🚀
