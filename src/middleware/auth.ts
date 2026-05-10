import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import prisma from '../utils/prisma';
import { auth as firebaseAuth } from '../config/firebase-admin';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Firebase Token
    let decodedToken;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch (err) {
      console.error('[AUTH] Firebase Token Verification Failed:', err);
      throw ApiError.unauthorized('Invalid token');
    }

    const { email, uid } = decodedToken;

    if (!email) {
      throw ApiError.unauthorized('Invalid token: email missing');
    }

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, role: true },
    });

    // Auto-create user if they exist in Firebase but not in our DB
    if (!user) {
      // Check if this should be an admin (e.g., first user or specific email)
      const isAdminEmail = email === 'admin@boma.com' || email === 'admin@streetwear.com';
      
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash: 'FIREBASE_MANAGED', // Password is not stored here
          role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        },
        select: { id: true, email: true, role: true },
      });
      console.log(`[AUTH] Auto-created user from Firebase: ${email} (Role: ${user.role})`);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};
