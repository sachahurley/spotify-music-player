# 🎬 Dream Song Album Cover Animation Guide

## ✅ What's Already Set Up

Your animated album cover is now ready! Here's what was added:

1. **GSAP Library** installed (for professional animations)
2. **AnimatedAlbumCover Component** (`components/AnimatedAlbumCover.tsx`)
3. **Integration** in your Dream Song player page

---

## 🎨 How The Animation Works

The animation is a **7-second loop** with three phases:

### Phase 1: Zoom & Rotate (0-2 seconds)
- Image zooms in by 10%
- Rotates 3 degrees clockwise
- Smooth, gentle movement

### Phase 2: Brightness Pulse (2-4 seconds)
- Brightness increases by 15%
- Slight additional zoom
- Creates a "glowing" effect

### Phase 3: Return (4-7 seconds)
- Everything smoothly returns to original state
- Longer duration for graceful transition
- Then loops back to beginning

---

## 🎯 Viewing Your Animation

1. **Start the dev server:**
   ```bash
   cd /Users/sachahurley/bf-prototype-home
   npm run dev
   ```

2. **Navigate to Dream Song:**
   - Go to http://localhost:3000
   - Click on "Dream Song" by Jeff Kolhede
   - Press play to see the animation sync with the music!

3. **Toggle UI visibility:**
   - Click the eye icon to hide all UI elements
   - Now you see ONLY the animated album cover
   - Perfect for recording the Spotify Canvas video!

---

## 🛠️ Customizing the Animation

Open `components/AnimatedAlbumCover.tsx` and find the animation timeline section:

### Change Animation Timing:
```typescript
// Make it slower (10 seconds instead of 7):
timeline.to(img, {
  scale: 1.1,
  rotation: 3,
  duration: 3,  // ← Change this (was 2)
  ease: 'power1.inOut'
}, 0);
```

### Add More Effects:
```typescript
// Add a fade effect:
timeline.to(img, {
  opacity: 0.8,           // Fade to 80% opacity
  duration: 1.5,
  ease: 'sine.inOut'
}, 1);  // Start at 1 second
```

### Change Rotation Amount:
```typescript
rotation: 10,  // More dramatic rotation (was 3)
```

### Adjust Zoom:
```typescript
scale: 1.2,  // Zoom more (was 1.1 = 10%, now 1.2 = 20%)
```

### Different Easing Functions:
```typescript
ease: 'elastic.out'    // Bouncy effect
ease: 'bounce.out'     // Bouncing effect
ease: 'power2.inOut'   // Smooth
ease: 'expo.inOut'     // Dramatic acceleration
```

---

## 📹 Exporting to Spotify Canvas MP4

### Option 1: Screen Recording (EASIEST)

Since I see you have **Screen Studio** on your Mac, this is perfect!

**Steps:**

1. **Prepare the Animation:**
   - Run your dev server: `cd /Users/sachahurley/spotify-music-player && npm run dev`
   - Navigate to Dream Song player
   - Click the eye icon to hide all UI (only album cover shows)
   - Press play to start the animation

2. **Set Up Screen Studio:**
   - Open Screen Studio
   - Set recording dimensions to **9:16 vertical** (Spotify Canvas format)
   - Position the recording area over just the album cover
   - **Frame rate:** 30fps or 60fps

3. **Record:**
   - Start recording
   - Let the animation loop for at least 7 seconds (one full loop)
   - Stop recording

4. **Export:**
   - Trim to exactly 7 seconds
   - Export as **MP4**
   - Resolution: **1080x1920** (or 720x1280)

**Spotify Canvas Requirements:**
- Format: MP4 (H.264)
- Aspect Ratio: 9:16 (vertical)
- Duration: 3-8 seconds (your 7 seconds is perfect!)
- File Size: Under 10MB
- Resolution: 720x1280 minimum, 1080x1920 recommended

---

### Option 2: Browser Recording (More Technical)

If you want perfect quality without manual recording:

1. **Using Playwright** (automated browser recording):
   ```bash
   npm install -D playwright
   ```

2. **Create recording script** - Let me know if you want help with this!

---

## 🎨 Animating SPECIFIC Parts of the SVG

Right now, the animation affects the **entire image**. If you want to animate specific parts (like just the person, or just the sky), you'll need to:

### Method 1: Separate the SVG into layers in Illustrator
1. Open `NOVEL_TEA_FINAL.ai` in Adobe Illustrator
2. Separate elements onto different layers
3. Export each layer as a separate SVG
4. Stack them in the component
5. Animate each separately with GSAP

### Method 2: Add IDs to SVG elements (advanced)
1. Open the SVG file
2. Find specific `<path>` or `<g>` elements
3. Add `id="person"` or `id="sky"` attributes
4. Target them with GSAP: `gsap.to("#person", { ... })`

**Want help with either of these?** Just ask!

---

## 🚀 Next Steps

### For Testing:
1. Run `npm run dev`
2. Navigate to Dream Song
3. Press play and watch the animation
4. Try hiding the UI with the eye icon

### For Customization:
1. Open `components/AnimatedAlbumCover.tsx`
2. Find the timeline section (around line 60)
3. Adjust the animation values
4. Save and see changes live!

### For Spotify Canvas:
1. Use Screen Studio to record
2. Export as 9:16 MP4
3. Upload to Spotify for Artists

---

## 📚 GSAP Animation Properties

Here are all the properties you can animate:

| Property | What it does | Example |
|----------|--------------|---------|
| `scale` | Zoom in/out | `scale: 1.2` (20% bigger) |
| `rotation` | Rotate in degrees | `rotation: 45` |
| `x` | Move horizontally | `x: 100` (100px right) |
| `y` | Move vertically | `y: -50` (50px up) |
| `opacity` | Fade in/out | `opacity: 0.5` (50% transparent) |
| `filter` | CSS filters | `filter: 'blur(5px)'` |
| `rotationX` | 3D rotate X axis | `rotationX: 45` |
| `rotationY` | 3D rotate Y axis | `rotationY: 45` |
| `skewX` | Skew horizontally | `skewX: 10` |
| `skewY` | Skew vertically | `skewY: 10` |

---

## 🆘 Troubleshooting

### Animation not visible?
- Check browser console for errors (F12)
- Make sure you're on the Dream Song page (song-2)
- Press play button to start animation

### Animation too fast/slow?
- Adjust `duration` values in the timeline

### Want animation to always play (not just when music plays)?
In `AnimatedAlbumCover.tsx`, change line 48:
```typescript
paused: false  // ← Change from: paused: !isPlaying
```

### Animation feels jumpy?
- Add `will-change: 'transform'` to the image style
- Try different easing functions

---

## 💡 Pro Tips

1. **Test on mobile:** Animations might perform differently on phones
2. **Keep it subtle:** Too much movement can be distracting
3. **Loop seamlessly:** Make sure the end state matches the start state
4. **Use easing:** Never use linear animations - always use easing for natural feel
5. **Preview before recording:** Watch the animation loop 3-4 times before recording

---

## 🎓 Learning Resources

Want to learn more about GSAP?

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [GSAP CodePen Examples](https://codepen.io/collection/ANaOod)

---

## ✨ Example Customizations

### Slow, Dreamy Effect:
```typescript
timeline.to(img, {
  scale: 1.05,
  rotation: 2,
  filter: 'brightness(1.1)',
  duration: 3.5,
  ease: 'sine.inOut'
}, 0);
```

### Energetic, Bouncy Effect:
```typescript
timeline.to(img, {
  scale: 1.15,
  rotation: 5,
  duration: 1,
  ease: 'elastic.out'
}, 0);
```

### Subtle Breathing Effect:
```typescript
timeline.to(img, {
  scale: 1.03,
  filter: 'brightness(1.05)',
  duration: 3.5,
  ease: 'power1.inOut',
  yoyo: true  // Goes back and forth
}, 0);
```

---

**Questions?** Let me know what you'd like to adjust or if you need help with anything!
