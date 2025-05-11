import express from 'express';
import expenseController from '../controllers/expenseController';
import { authenticateUser } from '../middlewares/auth';

const router = express.Router();

// All routes are protected with authentication
router.use(authenticateUser);

// CRUD routes
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/stats', expenseController.getStats);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;