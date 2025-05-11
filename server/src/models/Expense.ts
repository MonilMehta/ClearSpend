import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model<IExpense>('Expense', expenseSchema);