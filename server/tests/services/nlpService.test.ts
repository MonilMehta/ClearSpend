import { processExpenseMessage, categorizeExpense } from '../../src/services/nlpService';

describe('NLP Service', () => {
    describe('processExpenseMessage', () => {
        it('should correctly parse a simple expense message', () => {
            const message = 'Paid ₹250 for lunch';
            const result = processExpenseMessage(message);
            expect(result).toEqual({
                amount: 250,
                category: 'Food',
                description: 'lunch',
            });
        });

        it('should handle messages with different formats', () => {
            const message = 'Spent ₹500 on groceries';
            const result = processExpenseMessage(message);
            expect(result).toEqual({
                amount: 500,
                category: 'Groceries',
                description: 'groceries',
            });
        });

        it('should return null for invalid messages', () => {
            const message = 'Invalid message format';
            const result = processExpenseMessage(message);
            expect(result).toBeNull();
        });
    });

    describe('categorizeExpense', () => {
        it('should categorize expenses correctly', () => {
            const description = 'lunch';
            const result = categorizeExpense(description);
            expect(result).toEqual('Food');
        });

        it('should return "Other" for unknown categories', () => {
            const description = 'unknown expense';
            const result = categorizeExpense(description);
            expect(result).toEqual('Other');
        });
    });
});