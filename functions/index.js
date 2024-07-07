/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Create and deploy your deleteUser function
exports.deleteUser = onCall(async (data) => {
  const email = data.email;

  try {
    // Find the user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(userRecord.uid);

    // Delete the user document from Firestore
    const userDoc = admin.firestore().collection("users").doc(userRecord.uid);
    await userDoc.delete();

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user: " + error.message);
  }
});