import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { JwtPayload } from '../middleware/auth';

const SALT_ROUNDS = 12;

export class AuthService {
  async register(email: string, password: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[AUTH] Login attempt for: ${normalizedEmail}`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.warn(`[AUTH] User not found: ${normalizedEmail}`);
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      console.warn(`[AUTH] Invalid password for: ${normalizedEmail}`);
      throw ApiError.unauthorized('Invalid credentials');
    }

    console.log(`[AUTH] Successful login for: ${normalizedEmail} (Role: ${user.role})`);

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string,
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();
