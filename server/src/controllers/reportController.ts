import { Request, Response } from 'express';
import Expense from '../models/Expense';

class ReportController {
    async getReports(req: Request, res: Response) {
        try {
            // TODO: Add user filtering based on authentication
            // TODO: Add date range and other filtering options (e.g., req.query)

            const expenses = await Expense.find({}).sort({ date: -1 }); // Fetch all for now, sorted by date

            // Basic report structure - can be expanded significantly
            const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = expenses.length;
            const expensesByCategory: { [key: string]: number } = {};
            expenses.forEach(expense => {
                expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
            });

            const report = {
                totalAmount,
                count,
                expensesByCategory,
                detailedExpenses: expenses // Include detailed list for now
            };

            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error generating report', error });
        }
    }
}

export default new ReportController();
