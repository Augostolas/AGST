# AGST Portfolio

A terminal-inspired portfolio for Roblox environments, gameplay systems, animation, and VFX.

## Features

- Responsive project gallery with building, scripting, animation, and VFX sections
- Three hidden commands with local discovery progress and an optional Firebase global counter
- Keyboard-accessible section tabs and project navigation
- Reduced-motion support, an explicit music control, and lazy-loaded previews
- Red-and-white King Geedorah theme and Matrix completion effect

## Development

The site uses static HTML, CSS, and JavaScript modules. Run it through HTTP so browser module imports work:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` and run the validation suite before publishing:

```bash
npm run validate
```

## Content

Project entries live in the `folders` object in `script.js`. Preview assets belong in the matching folder under `assets/`.

The command line accepts only easter egg phrases. Arrow Up and Arrow Down move through previous entries. The visible tabs handle normal portfolio navigation.

## Deployment

`.github/workflows/static.yml` validates the site, builds a minimal `_site` artifact, and deploys it to GitHub Pages after pushes to `main`.

Production URL: https://augostolas.github.io/AGST/

Firebase setup is documented in `FIREBASE_SETUP.md`.
