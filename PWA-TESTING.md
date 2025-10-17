# PWA Testing Guide for InstantCube

## ✅ PWA Setup Complete!

Your InstantCube app is now a Progressive Web App with:
- ✅ Service Worker for offline caching
- ✅ Web App Manifest
- ✅ PWA Icons (192x192 and 512x512)
- ✅ Installable on mobile and desktop
- ✅ Works offline after first visit

---

## 🧪 Testing PWA Locally

### 1. Build and Start Production Server

```bash
# Build the app (generates service worker)
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

### 2. Test in Chrome DevTools

1. Open Chrome and go to `http://localhost:3000`
2. Open DevTools (F12)
3. Go to **Application** tab
4. Check these sections:

#### Manifest
- Should show "InstantCube - Rubik's Cube Solver"
- Icons should be visible
- Theme color: #3b82f6

#### Service Workers
- Should show `/sw.js` as active
- Status should be "activated and running"

#### Cache Storage
- Should show `offlineCache` and `workbox-precache`
- Contains cached pages and assets

### 3. Test Offline Functionality

1. In DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Reload the page
4. ✅ App should still work completely offline!

### 4. Test Install Prompt

**On Desktop (Chrome/Edge):**
1. Look for install icon in address bar (⊕ or install button)
2. Click to install
3. App opens in standalone window

**On Mobile (Chrome/Safari):**
1. Tap browser menu (⋮)
2. Select "Add to Home Screen" or "Install App"
3. App icon appears on home screen
4. Opens like a native app

---

## 🚀 Testing on Deployed Site (Vercel)

### Requirements for PWA on Production:
- ✅ HTTPS (Vercel provides this automatically)
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Icons available

### After Deploying to Vercel:

1. Visit your deployed URL (https://your-app.vercel.app)
2. Open Chrome DevTools → Lighthouse
3. Run PWA audit
4. Should score 90+ on PWA metrics

### Test Install on Mobile:

1. Open deployed URL on phone
2. Browser should show install banner
3. Install and test offline mode:
   - Install app
   - Turn off WiFi/data
   - Open app from home screen
   - ✅ Should work offline!

---

## 🔍 Troubleshooting

### Service Worker Not Registering

**Symptom:** No service worker in DevTools
**Fix:**
- Make sure you ran `npm run build` (not `npm run dev`)
- Service workers only work in production builds
- Check browser console for errors

### "Offline" Mode Not Working

**Symptom:** App shows error when offline
**Fix:**
- Visit app while online first (to cache assets)
- Check Cache Storage in DevTools has cached files
- Reload page to ensure service worker is active

### Install Prompt Not Showing

**Symptom:** No install button appears
**Fix:**
- PWA install prompts only work on HTTPS (or localhost)
- Chrome hides prompt if previously dismissed
- Try in Incognito mode
- Check manifest.json is valid in DevTools

### Icons Not Loading

**Symptom:** Manifest shows missing icons
**Fix:**
- Verify `/public/icon-192.png` and `/public/icon-512.png` exist
- Rebuild with `npm run build`
- Check browser Network tab for 404s

---

## 📱 PWA Features Enabled

### Offline-First Architecture
- NetworkFirst caching strategy
- All pages cached after first visit
- Works without internet connection

### Installable
- Add to home screen on mobile
- Install as desktop app
- Standalone display (no browser UI)

### App-Like Experience
- Custom splash screen
- Theme color matches app design
- Portrait orientation on mobile

---

## 🎯 Next Steps

1. **Deploy to Vercel:**
   ```bash
   git add .
   git commit -m "Add PWA support"
   git push
   ```

2. **Test on Real Devices:**
   - Test install on iPhone (Safari)
   - Test install on Android (Chrome)
   - Test offline mode on mobile

3. **Run Lighthouse Audit:**
   - Should score 90+ on PWA
   - Should score 90+ on Performance
   - Address any issues found

4. **Share Your PWA:**
   - Users can install directly from browser
   - No app store needed!
   - Works on all modern browsers

---

## 📚 Resources

- [Next PWA Docs](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)

**Note:** The app currently has a basic solver implementation. The PWA features are fully functional - you can install it, use it offline, and have an app-like experience while we continue improving the solving algorithms!
