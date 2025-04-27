import { Request, Response } from 'express';
import Expense from '../models/Expense';

class ExpenseController {
    async createExpense(req: Request, res: Response) {
        try {
            const { amount, category, description } = req.body;
            const expense = new Expense({ amount, category, description });
            await expense.save();
            res.status(201).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error creating expense', error });
        }
    }

    async getExpenses(req: Request, res: Response) {
        try {
            const expenses = await Expense.find();
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expenses', error });
        }
    }

    async getExpenseById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const expense = await Expense.findById(id);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expense', error });
        }
    }

    async deleteExpense(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const expense = await Expense.findByIdAndDelete(id);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting expense', error });
        }
    }
}

export default new ExpenseController();