import { Router } from 'express';
import authRoutes from './authRoutes.js';
import issueRoutes from './issueRoutes.js';
import statsRoutes from './statsRoutes.js';
import auditRoutes from './auditRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/issues', issueRoutes);
apiRouter.use('/stats', statsRoutes);
apiRouter.use('/audit', auditRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'NagarChitra Civic-Tech Core API',
    version: '1.0.0',
  });
});

export default apiRouter;
