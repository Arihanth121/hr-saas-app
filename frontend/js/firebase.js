// Initialize Firebase
const firebaseConfig = CONFIG.firebase[CONFIG.env];
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();