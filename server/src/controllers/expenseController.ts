import { Request, Response } from 'express';
import prisma from '../config/database';
import { Decimal } from '@prisma/client/runtime/library';

// Extend Request type to include user (assuming auth middleware adds it)
interface AuthenticatedRequest extends Request {
    user?: { id: string }; // Adjust based on your auth middleware
}

class ExpenseController {
    async createExpense(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = req.user.id;
            const { amount, category, description, date } = req.body;
            
            const expense = await prisma.expense.create({
                data: {
                    userId,
                    amount: new Decimal(amount),
                    category,
                    description,
                    date: date ? new Date(date) : new Date()
                }
            });
            
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
            const expenses = await prisma.expense.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            });
            
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
            
            const expense = await prisma.expense.findFirst({
                where: { 
                    id,
                    userId 
                }
            });
            
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
            
            const expense = await prisma.expense.updateMany({
                where: { 
                    id,
                    userId 
                },
                data: {
                    amount: amount ? new Decimal(amount) : undefined,
                    category,
                    description,
                    date: date ? new Date(date) : undefined
                }
            });
            
            if (expense.count === 0) {
                return res.status(404).json({ message: 'Expense not found or access denied' });
            }
            
            // Fetch the updated expense to return it
            const updatedExpense = await prisma.expense.findFirst({
                where: { id, userId }
            });
            
            res.status(200).json(updatedExpense);
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
            
            const expense = await prisma.expense.deleteMany({
                where: { 
                    id,
                    userId 
                }
            });
            
            if (expense.count === 0) {
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
            const expenses = await prisma.expense.findMany({
                where: { userId }
            });

            const totalAmount = expenses.reduce((sum: number, expense: any) => {
                return sum + Number(expense.amount);
            }, 0);
            const count = expenses.length;
            // Add more stats calculations as needed (e.g., by category)
             const expensesByCategory: { [key: string]: number } = {};
            expenses.forEach((expense: any) => {
                const categoryTotal = expensesByCategory[expense.category] || 0;
                expensesByCategory[expense.category] = categoryTotal + Number(expense.amount);
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
}

export default new ExpenseController();