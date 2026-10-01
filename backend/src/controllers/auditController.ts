import { Response } from 'express';
import prisma from '../services/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export async function getAuditLogs(req: AuthRequest, res: Response) {
  try {
    const logs = await prisma.securityAuditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch audit logs',
    });
  }
}
