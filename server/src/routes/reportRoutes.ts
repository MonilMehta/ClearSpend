import { Router } from 'express';
import ReportController from '../controllers/reportController';

const router = Router();

// TODO: Add authentication middleware here
router.get('/', ReportController.getReports);

export default router;
