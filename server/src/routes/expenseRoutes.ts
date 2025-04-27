import { Router } from 'express';
import ExpenseController from '../controllers/expenseController';

const router = Router();
const expenseController = new ExpenseController();

router.post('/expenses', expenseController.createExpense);
router.get('/expenses', expenseController.getExpenses);
router.get('/expenses/:id', expenseController.getExpenseById);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

export default router;