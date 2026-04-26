
firebase.initializeApp(CONFIG.firebase[CONFIG.env]);
const auth = firebase.auth();
const db = firebase.firestore();
