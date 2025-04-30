import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
    phoneNumber: string; // Primary identifier, format E.164 e.g., +14155238886
    telegramId?: string; // Optional linked Telegram User ID
    name?: string; // Optional user name
    monthlyLimit?: number;
    googleSheetId?: string; // Optional ID of the linked Google Sheet
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    phoneNumber: { type: String, required: true, unique: true, index: true },
    telegramId: { type: String, unique: true, sparse: true }, // Unique only if present
    name: { type: String },
    monthlyLimit: { type: Number },
    googleSheetId: { type: String }, // Add field for Google Sheet ID
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
