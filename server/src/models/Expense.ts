import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type Expense = Awaited<ReturnType<typeof prisma.expense.findUnique>>;
export type IExpense = NonNullable<Expense>;

// Export a default object for backward compatibility if needed
export default {
    // You can add utility methods here if needed
};