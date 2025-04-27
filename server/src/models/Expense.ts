import mongoose, { Document, Schema, Types } from 'mongoose';
import { ExpenseCategory } from '../constants/categories'; // Import categories

export interface IExpense extends Document {
    userId: Types.ObjectId; // Link to the User model
    amount: number;
    category: ExpenseCategory; // Use the enum for category
    description: string;
    date: Date;
    source: 'whatsapp' | 'telegram' | 'web'; // Track where the expense was added from
    messageSid?: string; // Optional: Twilio Message SID for reference
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, enum: Object.values(ExpenseCategory) }, // Validate against enum
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    source: { type: String, required: true, enum: ['whatsapp', 'telegram', 'web'] },
    messageSid: { type: String },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Index for common queries
ExpenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;