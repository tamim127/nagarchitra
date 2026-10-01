import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../services/prisma.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['CITIZEN', 'AUTHORITY', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR']).default('CITIZEN'),
  department: z.string().optional(),
  designation: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response) {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        phone: validated.phone,
        role: validated.role as any,
        department: validated.department,
        designation: validated.designation,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(validated.name)}`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        designation: true,
        avatar: true,
        location: true,
        impactScore: true,
        reportsCount: true,
        verifiedCount: true,
        resolvedCount: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await prisma.securityAuditLog.create({
      data: {
        eventType: 'USER_REGISTERED',
        email: newUser.email,
        role: newUser.role,
        severity: 'INFO',
        details: `User registered with role ${newUser.role}`,
        ipAddress: req.ip,
      },
    }).catch(() => null);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating user',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validated = loginSchema.parse(req.body);
    const email = validated.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Audit log failed attempt
      await prisma.securityAuditLog.create({
        data: {
          eventType: 'LOGIN_FAILED',
          email,
          role: 'UNKNOWN',
          severity: 'WARN',
          details: 'Login attempted with non-existent email',
          ipAddress: req.ip,
        },
      }).catch(() => null);

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isValidPassword) {
      await prisma.securityAuditLog.create({
        data: {
          eventType: 'LOGIN_FAILED',
          email,
          role: user.role,
          severity: 'WARN',
          details: 'Incorrect password supplied',
          ipAddress: req.ip,
        },
      }).catch(() => null);

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.securityAuditLog.create({
      data: {
        eventType: 'LOGIN_SUCCESS',
        email: user.email,
        role: user.role,
        severity: 'INFO',
        details: 'User authenticated successfully',
        ipAddress: req.ip,
      },
    }).catch(() => null);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          department: user.department,
          designation: user.designation,
          avatar: user.avatar,
          location: user.location,
          impactScore: user.impactScore,
          reportsCount: user.reportsCount,
          verifiedCount: user.verifiedCount,
          resolvedCount: user.resolvedCount,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        designation: true,
        avatar: true,
        location: true,
        impactScore: true,
        reportsCount: true,
        verifiedCount: true,
        resolvedCount: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user',
    });
  }
}
