import { Router } from 'express';
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  confirmIssue,
  voteResolution,
  followIssue,
  getNearbyDuplicates,
} from '../controllers/issueController.js';
import {
  authenticateToken,
  optionalAuthenticateToken,
  requireRoles,
} from '../middlewares/authMiddleware.js';

const router = Router();

// Nearby duplicates detection
router.get('/nearby', getNearbyDuplicates);

// List issues with filters (optional auth to personalize confirm/follow status)
router.get('/', optionalAuthenticateToken, getIssues);

// Get single issue details
router.get('/:id', optionalAuthenticateToken, getIssueById);

// Submit new civic issue (optional auth or citizen)
router.post('/', optionalAuthenticateToken, createIssue);

// Authority / Admin update issue status & timeline
router.patch(
  '/:id/status',
  authenticateToken,
  requireRoles('AUTHORITY', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'),
  updateIssueStatus
);

// Citizen confirm issue ("I See This Too")
router.post('/:id/confirm', optionalAuthenticateToken, confirmIssue);

// Citizen vote resolution ("FIXED" or "STILL_EXISTS")
router.post('/:id/vote', optionalAuthenticateToken, voteResolution);

// Toggle follow issue updates
router.post('/:id/follow', authenticateToken, followIssue);

export default router;
