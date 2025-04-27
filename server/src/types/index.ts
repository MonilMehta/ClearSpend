export interface Expense {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
}

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    expenses: Expense[];
}

export interface ExpenseSummary {
    totalSpent: number;
    categoryBreakdown: Record<string, number>;
    dailyTrends: Array<{ date: string; amount: number }>;
}

export interface IncomingMessage {
    type: 'text' | 'image' | 'voice';
    content: string | Buffer;
    userId: string;
    timestamp: Date;
}