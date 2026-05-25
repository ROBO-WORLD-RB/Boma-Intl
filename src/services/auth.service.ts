import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';

export class AuthService {
  async register(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Create user (Firebase handles the actual registration)
      const isOwnerEmail = normalizedEmail === 'owner@boma.com' || normalizedEmail === 'admin@boma.com';
      const isDevEmail = normalizedEmail === 'dev@boma.com' || normalizedEmail === 'admin@streetwear.com';
      
      let assignedRole: 'OWNER' | 'DEVELOPER' | 'CUSTOMER' = 'CUSTOMER';
      if (isOwnerEmail) assignedRole = 'OWNER';
      else if (isDevEmail) assignedRole = 'DEVELOPER';

      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: 'FIREBASE_MANAGED',
          role: assignedRole,
        },
      });
    }

    return { 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }, 
      token: 'FIREBASE_TOKEN_USED' 
    };
  }

  async login(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // If user logs in with Firebase but doesn't exist in our DB yet
      return this.register(normalizedEmail);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: 'FIREBASE_TOKEN_USED',
    };
  }
}

export const authService = new AuthService();
