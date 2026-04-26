
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserProfile = functions.auth.user().onCreate(async (user)=>{
  await admin.firestore().collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    role: "user",
    orgId: "org_001",
    createdAt: new Date()
  });
});
