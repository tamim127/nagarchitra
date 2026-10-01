import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import prisma from '../services/prisma.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR';
  name: string;
  department?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required (Bearer token)',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: string;
      email: string;
      role: any;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        department: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user session or user no longer exists',
      });
    }

    req.user = user as AuthenticatedUser;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}

// Optional authentication (for public views where user might or might not be logged in)
export async function optionalAuthenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          department: true,
        },
      });
      if (user) {
        req.user = user as AuthenticatedUser;
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}

// Role authorization guard
export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] roles. Your role is '${req.user.role}'`,
      });
    }

    next();
  };
}
