import * as admin from 'firebase-admin';

const projectId = "boma-shop";

if (!admin.apps.length) {
  console.log(`[FIREBASE] Initializing Admin SDK for project: ${projectId}`);
  try {
    // In Vercel, it will try to find credentials in environment variables
    // (GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_CONFIG)
    admin.initializeApp({
      projectId: projectId,
    });
    console.log('[FIREBASE] Admin SDK initialized successfully');
  } catch (err: any) {
    console.error('[FIREBASE] Initialization Error:', err.message);
  }
}

export const auth = admin.auth();
