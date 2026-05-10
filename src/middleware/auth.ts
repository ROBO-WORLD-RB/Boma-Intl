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
  const authHeader = req.headers.authorization;
  console.log(`[AUTH] Verifying token for: ${req.method} ${req.path}`);
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('[AUTH] No Bearer token provided in header');
    return next(ApiError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify Firebase Token
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const { email } = decodedToken;

    if (!email) {
      console.error('[AUTH] Token verified but email is missing');
      return next(ApiError.unauthorized('Invalid token: email missing'));
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      console.log(`[AUTH] User ${normalizedEmail} not found in DB, auto-creating...`);
      const isAdminEmail = normalizedEmail === 'admin@boma.com' || normalizedEmail === 'admin@streetwear.com';
      
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: 'FIREBASE_MANAGED',
          role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        },
        select: { id: true, email: true, role: true },
      });
      console.log(`[AUTH] Auto-created user: ${normalizedEmail} (Role: ${user.role})`);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    console.log(`[AUTH] Success: ${normalizedEmail} (${user.role})`);
    next();
  } catch (error: any) {
    console.error('[AUTH] Token Verification Error:', error.message || error);
    next(ApiError.unauthorized(`Authentication failed: ${error.message || 'Invalid token'}`));
  }
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    console.warn(`[AUTH] Access denied: User ${req.user?.email} is not an ADMIN`);
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};
