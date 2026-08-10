# 🚀 GitHub Pages Deployment Guide

Your AGST portfolio is ready to go live on GitHub Pages!

## Quick Setup (2 minutes)

1. **Go to your repository settings:**
   - Visit: https://github.com/Augostolas/AGST/settings/pages

2. **Configure Pages:**
   - Under "Build and deployment"
   - Source: Select `Deploy from a branch`
   - Branch: Select `main`
   - Folder: Select `/ (root)`
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will automatically build and deploy
   - Check the "Deployments" tab to monitor progress
   - Look for the green checkmark ✓

4. **Your site is live!**
   - Visit: https://Augostolas.github.io/AGST
   - Share the link with potential clients/collaborators

## Troubleshooting

### Site not showing up?
- Wait 2-3 minutes for initial deployment
- Check the **Actions** tab to see if build succeeded
- Ensure you're on the correct branch

### Images not loading?
- Verify `assets/` folder exists (should be there after latest commit)
- Check browser console (F12) for 404 errors
- Clear browser cache and refresh

### Custom domain? (Optional)
- Add a `CNAME` file to the root with your domain
- Or configure in Settings > Pages > Custom domain

## What's Being Deployed

Your entire repository root serves as the website:
- `index.html` = Home page
- `style.css` & `script.js` = Styling and interactivity
- `assets/` folder = Project images
- `README.md` = Documentation (not visible on web)

## Next Steps

- [ ] Enable Pages deployment
- [ ] Verify site is live
- [ ] Share portfolio link
- [ ] Update Discord/social profiles with portfolio URL
- [ ] Monitor traffic in GitHub Insights

---

**Questions?** Check GitHub Pages docs: https://pages.github.com/
