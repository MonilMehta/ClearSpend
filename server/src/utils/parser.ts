import { Expense } from '../models/Expense';

export const parseExpenseMessage = (message: string) => {
    const regex = /(?:Paid|Spent|Cost|Total)\s*₹?(\d+)\s*for\s*(.+)/i;
    const match = message.match(regex);
    
    if (match) {
        const amount = parseInt(match[1], 10);
        const description = match[2].trim();
        return { amount, description };
    }
    
    return null;
};

export const parseImageData = (data: string) => {
    // Implement OCR parsing logic here
    // This function will process the OCR result and extract expense information
    return null;
};

export const parseVoiceNote = (transcription: string) => {
    // Implement voice note parsing logic here
    // This function will process the transcribed voice note and extract expense information
    return null;
};