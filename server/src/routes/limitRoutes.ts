import { Router } from 'express';
import LimitController from '../controllers/limitController';

const router = Router();

// In a real app, you'd likely get the user ID from authentication middleware
// instead of a route parameter for security.
router.put('/:userId', LimitController.updateLimit);

export default router;
