import { Request, Response } from 'express';
import Expense from '../models/Expense';
import { Types } from 'mongoose'; // Import Types

// Extend Request type to include user (assuming auth middleware adds it)
interface AuthenticatedRequest extends Request {
    user?: { id: string | Types.ObjectId }; // Adjust based on your auth middleware
}

class ExpenseController {
    async createExpense(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            const { amount, category, description, date } = req.body;
            const expense = new Expense({ userId, amount, category, description, date: date || new Date() });
            await expense.save();
            res.status(201).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error creating expense', error });
        }
    }

    async getExpenses(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            // TODO: Add pagination, filtering (date range, category) from query params
            const expenses = await Expense.find({ userId: userId }).sort({ date: -1 });
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expenses', error });
        }
    }

    async getExpenseById(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            const { id } = req.params;
            const expense = await Expense.findOne({ _id: id, userId: userId });
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found or access denied' });
            }
            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expense', error });
        }
    }

     async updateExpense(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            const { id } = req.params;
            const { amount, category, description, date } = req.body;
            const expense = await Expense.findOneAndUpdate(
                { _id: id, userId: userId }, // Ensure user owns the expense
                { amount, category, description, date },
                { new: true, runValidators: true }
            );
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found or access denied' });
            }
            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error updating expense', error });
        }
    }

    async deleteExpense(req: AuthenticatedRequest, res: Response) {
        try {
             if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            const { id } = req.params;
            const expense = await Expense.findOneAndDelete({ _id: id, userId: userId });
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found or access denied' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting expense', error });
        }
    }

    async getStats(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            // TODO: Add date range filtering from query params
            const expenses = await Expense.find({ userId: userId });

            const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = expenses.length;
            // Add more stats calculations as needed (e.g., by category)
             const expensesByCategory: { [key: string]: number } = {};
            expenses.forEach(expense => {
                expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
            });

            const stats = {
                totalAmount,
                count,
                expensesByCategory
            };

            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving stats', error });
        }
    }

    // updateExpense method was already present and is updated above
}

export default new ExpenseController();