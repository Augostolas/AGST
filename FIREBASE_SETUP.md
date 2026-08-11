# 🔥 Firebase Global Discovery Counter Setup

Your AGST portfolio now includes a **global discovery counter** that tracks how many users worldwide have discovered the hidden easter egg!

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project**
3. Name it: `agst-portfolio` (or your choice)
4. Click **Continue**
5. Keep defaults, click **Create project**

### Step 2: Set Up Realtime Database
1. In Firebase Console, go to **Build > Realtime Database**
2. Click **Create Database**
3. Choose location (closest to you or default)
4. Start in **Test Mode** (you can secure later)
5. Click **Enable**

### Step 3: Get Your Config
1. Go to **Project Settings** (gear icon)
2. Scroll down to find your Firebase config
3. Look for the JavaScript config code

### Step 4: Update config.js
Open `config.js` in your editor and update:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const firebaseEnabled = true;  // Set this to TRUE
```

### Step 5: Deploy
1. Commit changes:
   ```bash
   git add config.js
   git commit -m "Configure Firebase for global discovery tracking"
   git push origin main
   ```
2. GitHub Pages auto-deploys

## 📊 How It Works

- **Local Counter**: Shows YOUR discoveries (stored in browser localStorage)
- **Global Counter**: Shows total worldwide discoveries (stored in Firebase)
- **Sync**: Every time you discover the easter egg, both counters update

## 🔒 Security Rules (Recommended)

Once working, secure your database by replacing test mode rules:

```json
{
  "rules": {
    "discoveries": {
      "global_count": {
        ".read": true,
        ".write": "auth != null || !data.exists()"
      }
    }
  }
}
```

## ❓ Troubleshooting

**Global counter not updating?**
- Check if `firebaseEnabled = true` in config.js
- Check console (F12) for errors
- Verify Firebase credentials are correct
- Database URL should end in `.firebaseio.com`

**Want to reset the counter?**
- Go to Firebase Console > Realtime Database
- Find `discoveries > global_count`
- Delete and it resets to 0

## 🎯 Optional Enhancements

- Add admin panel to view/manage counter
- Log discoverer IPs/locations (privacy-aware)
- Add badges to your portfolio based on milestones
- Create a leaderboard (who found it first, etc.)

---

**Questions?** Check Firebase docs: https://firebase.google.com/docs/database
