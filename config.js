import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getDatabase, ref, runTransaction } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js';

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

const firebaseEnabled = true;
let db = null;

if (firebaseEnabled && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
        db = getDatabase(initializeApp(firebaseConfig));
    } catch (error) {
        console.warn('Global discovery tracking is unavailable.', error);
    }
}

export async function incrementGlobalDiscoveryCount() {
    if (!db) return;

    try {
        await runTransaction(ref(db, 'discoveries/global_count'), current => (current || 0) + 1);
    } catch (error) {
        console.warn('Could not update the global discovery count.', error);
    }
}
