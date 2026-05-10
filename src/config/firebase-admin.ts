import * as admin from 'firebase-admin';

const projectId = "boma-shop";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
    // Note: In production on Vercel, you should ideally set the 
    // FIREBASE_SERVICE_ACCOUNT_KEY environment variable.
    // For now, we'll initialize with just the project ID for public token verification.
  });
}

export const auth = admin.auth();
