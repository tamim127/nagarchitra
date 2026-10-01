import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticateToken, requireRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, requireRoles('ADMIN', 'SUPER_ADMIN'), getAuditLogs);

export default router;
