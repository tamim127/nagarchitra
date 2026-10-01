import { Router } from 'express';
import { getOverallStats, getAreaSummaries } from '../controllers/statsController.js';

const router = Router();

router.get('/overall', getOverallStats);
router.get('/areas', getAreaSummaries);

export default router;
