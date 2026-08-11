// Firebase Configuration
// To enable global discovery tracking:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project
// 3. Enable Realtime Database (Start in test mode)
// 4. Copy your config below and set firebaseEnabled = true

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Set to true after configuring Firebase
const firebaseEnabled = false;

// Initialize Firebase only if configured
let db = null;
let globalDiscoveryCount = 0;

if (firebaseEnabled && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        
        // Listen for global discovery count updates
        db.ref('discoveries/global_count').on('value', (snapshot) => {
            if (snapshot.exists()) {
                globalDiscoveryCount = snapshot.val();
                const counter = document.getElementById('globalEggCounter');
                if (counter) {
                    counter.textContent = String(globalDiscoveryCount);
                }
            }
        });
    } catch (error) {
        console.warn('Firebase not configured. Global discovery tracking disabled.');
    }
}

// Function to increment global counter
async function incrementGlobalDiscoveryCount() {
    if (db) {
        try {
            await db.ref('discoveries/global_count').transaction((current) => {
                return (current || 0) + 1;
            });
        } catch (error) {
            console.warn('Could not update global count:', error);
        }
    }
}
