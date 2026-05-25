import * as admin from 'firebase-admin';

const projectId = "boma-shop";

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (privateKey && clientEmail) {
      console.log(`[FIREBASE] Initializing Admin SDK with Service Account for project: ${projectId}`);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'), // Correctly handle newlines in Vercel env variables
        }),
      });
    } else {
      console.log(`[FIREBASE] Initializing Admin SDK with default credentials for project: ${projectId}`);
      admin.initializeApp({
        projectId: projectId,
      });
    }
    console.log('[FIREBASE] Admin SDK initialized successfully');
  } catch (err: any) {
    console.error('[FIREBASE] Initialization Error:', err.message);
  }
}

export const auth = admin.auth();
