import { Router } from 'express';
import ExpenseController from '../controllers/expenseController';

const router = Router();
// Removed duplicate controller instantiation

router.post('/expenses', ExpenseController.createExpense);
router.get('/expenses', ExpenseController.getExpenses);
router.get('/stats', ExpenseController.getStats); // Add stats route
router.get('/expenses/:id', ExpenseController.getExpenseById);
router.put('/expenses/:id', ExpenseController.updateExpense);
router.delete('/expenses/:id', ExpenseController.deleteExpense);

export default router;