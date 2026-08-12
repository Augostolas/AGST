// Firebase Configuration
// Global discovery tracking enabled for AGST Portfolio

const firebaseConfig = {
    apiKey: "AIzaSyDvIMKGsRpzhYC3TloMlmfaPEnTQefUYVU",
    authDomain: "agst-77e17.firebaseapp.com",
    databaseURL: "https://agst-77e17.firebaseio.com",
    projectId: "agst-77e17",
    storageBucket: "agst-77e17.firebasestorage.app",
    messagingSenderId: "799641000027",
    appId: "1:799641000027:web:0d2cdd25bf01e3c88f077e",
    measurementId: "G-2HSZXNVW1N"
};

// Set to true after configuring Firebase
const firebaseEnabled = true;

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
                document.dispatchEvent(new CustomEvent('globalEggUpdate', {
                    detail: { count: globalDiscoveryCount }
                }));
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
