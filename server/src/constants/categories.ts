// Export categories as a simple array of strings for NLP
export const CATEGORIES: string[] = [
    'Groceries',
    'Utilities',
    'Rent/Mortgage',
    'Transportation',
    'Food/Dining Out',
    'Entertainment',
    'Healthcare',
    'Personal Care',
    'Clothing',
    'Education',
    'Gifts/Donations',
    'Insurance',
    'Taxes',
    'Travel',
    'Subscriptions',
    'Other'
];

// You can keep the enum if it's used elsewhere, but the array is needed for NLP
export enum ExpenseCategory {
    GROCERIES = 'Groceries',
    UTILITIES = 'Utilities',
    RENT_MORTGAGE = 'Rent/Mortgage',
    TRANSPORTATION = 'Transportation',
    FOOD_DINING = 'Food/Dining Out',
    ENTERTAINMENT = 'Entertainment',
    HEALTHCARE = 'Healthcare',
    PERSONAL_CARE = 'Personal Care',
    CLOTHING = 'Clothing',
    EDUCATION = 'Education',
    GIFTS_DONATIONS = 'Gifts/Donations',
    INSURANCE = 'Insurance',
    TAXES = 'Taxes',
    TRAVEL = 'Travel',
    SUBSCRIPTIONS = 'Subscriptions',
    OTHER = 'Other'
}
