# AGST Portfolio

A retro-themed, terminal-style portfolio website showcasing animation, building, scripting, and VFX work.

## 🎮 Features

- **Terminal Interface** - DOS-inspired CLI experience with project file manager
- **CRT Overlay** - Authentic scanline effects and color distortion
- **Project Gallery** - Browse work across multiple disciplines:
  - **Animating** - Animation loops, rigging notes, and motion assets
  - **Building** - Environment art and scene construction
  - **Scripting** - Backend systems and interaction logic
  - **VFXing** - Particle effects, shaders, and visual polish

- **Interactive Commands** - Full CLI command support:
  - `projects` - Open project file manager
  - `open [folder]` - Browse specific project category
  - `contact` - View contact information
  - `prices` - See pricing tiers
  - `help` - Display all available commands
  - Easter eggs: `admin` (RGB mode), `matrix` (Matrix rain effect)

- **Responsive Design** - Mobile-friendly layout adapting to smaller screens
- **Easter Egg Counter** - Track hidden discoveries in the top-right corner
- **Command History** - Navigate through previous commands with arrow keys

## 📁 Project Structure

```
AGST/
├── index.html          # Main HTML structure
├── style.css           # Terminal styling and animations
├── script.js           # CLI logic and interactivity
├── assets/
│   └── building/       # Environment art and scene previews
├── anime_eye.gif       # Animation asset preview
└── README.md           # This file
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Augostolas/AGST.git
   cd AGST
   ```

2. **Open in browser:**
   - Double-click `index.html`, or
   - Run a local server:
     ```bash
     python -m http.server 8000
     # or with Node.js
     npx http-server
     ```
   - Visit `http://localhost:8000`

## 💬 Commands Reference

| Command | Action |
|---------|--------|
| `projects` | View all project categories |
| `open animating` | Browse animation files |
| `open building` | Browse building/environment art |
| `open scripting` | Browse scripting files |
| `open vfxing` | Browse VFX files |
| `contact` | Display contact details |
| `prices` | Show pricing information |
| `help` | List all available commands |
| `cls` | Clear terminal output |
| `boot` | Restart loading sequence |

## 🎨 Customization

### Update Contact Info
Edit the `renderContact()` function in `script.js` (around line 254):
```javascript
<p>Email   : your-email@example.com</p>
<p>Discord : @your_handle</p>
```

### Update Pricing
Edit the `renderPrices()` function in `script.js` (around line 267).

### Add Project Files
Modify the `folders` object in `script.js` (around line 18) to include new projects and assets.

## 🖼️ Adding Images

Place preview images in `assets/building/` and reference them in the `folders` configuration:
```javascript
{
    name: 'your-image.png',
    description: 'Your image description.',
    preview: 'assets/building/your-image.png'
}
```

## 🌐 Deployment

### GitHub Pages
1. Go to repository **Settings > Pages**
2. Under "Build and deployment", select:
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
3. Click Save
4. Your site will be live at `https://Augostolas.github.io/AGST`

### Other Hosting
- **Vercel:** Connect your GitHub repo directly
- **Netlify:** Drag and drop the folder or connect GitHub
- **Traditional hosting:** Upload all files via FTP/SFTP

## 🔧 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled

## 🎯 Tips

- Press **F1** for quick help
- Use **arrow keys** to navigate command history
- Click folder/file buttons to navigate projects
- Discover hidden commands for easter eggs
- Check the **EASTER_EGG.LOG** counter in top-right

## 📝 License

This project is part of AGST's professional portfolio.

---

**Status:** Portfolio is actively maintained. Check back for new projects and features!
