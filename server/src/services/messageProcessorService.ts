import { IUser } from '../models/User';
import { classifyExpense, extractIntent } from './nlpService'; // Assuming basic NLP functions exist
import { sendWhatsAppMessage } from './twilioService'; // To send replies
import Expense from '../models/Expense'; // To save expenses
import { CATEGORIES } from '../constants/categories'; // Import categories

// Placeholder for more complex state management if needed (e.g., Redis)
const userState: { [key: string]: { lastIntent: string, expecting?: string } } = {};

/**
 * Processes an incoming text message from a user.
 * Determines intent, extracts information, interacts with other services, and returns a response.
 */
export const processTextMessage = async (user: IUser, message: string, messageSid: string): Promise<string> => {
    console.log(`Processing text message SID ${messageSid} for user ${user.phoneNumber}: "${message}"`);

    // Basic command handling
    const lowerCaseMessage = message.toLowerCase().trim();

    if (lowerCaseMessage === 'hello' || lowerCaseMessage === 'hi') {
        return `Hi ${user.name || 'there'}! How can I help you track your spending today?`;
    }

    if (lowerCaseMessage === 'report') {
        // TODO: Implement report generation (fetch expenses, summarize)
        return 'Report generation is not implemented yet.';
    }

    if (lowerCaseMessage.startsWith('set limit')) {
        // TODO: Implement limit setting
        return 'Setting spending limits is not implemented yet.';
    }

    // --- Expense Logging Attempt ---
    // Try to parse as an expense using NLP (very basic example)
    try {
        // Example: "Paid $15.50 for lunch" or "Spent 20 on groceries"
        // More robust parsing needed here
        const amountMatch = message.match(/\$?(\d+(\.\d{1,2})?)/); // Simple currency/number match
        const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

        if (amount !== null && amountMatch) { // Add check for amountMatch as well
            // Use NLP to classify
            const classification = await classifyExpense(message, CATEGORIES);
            const category = classification.labels[0]; // Highest confidence category
            const score = classification.scores[0];

            // Simple description extraction (remove amount part)
            let description = message.replace(amountMatch[0], '').trim();
            // Remove common expense keywords if needed
            description = description.replace(/^(paid|spent|cost)\s+/i, '').trim();
            description = description.replace(/\s+(for|on)$/i, '').trim();
            description = description || `Expense (${category})`; // Default description

            console.log(`Parsed Expense: Amount=${amount}, Category=${category} (Score: ${score}), Desc=${description}`);

            // Save the expense
            const newExpense = new Expense({
                userId: user._id,
                amount: amount,
                category: category,
                description: description,
                date: new Date(), // Use current date for now
                source: 'whatsapp',
                messageSid: messageSid,
            });
            await newExpense.save();

            return `✅ Logged: ${amount.toFixed(2)} for ${description} (Category: ${category}).`;

        } else {
            // If no amount found, treat as general query or unrecognized command
            return "Sorry, I didn't understand that. You can tell me about expenses like 'Paid $10 for coffee' or ask for a 'report'.";
        }

    } catch (error: any) {
        console.error(`Error processing message for expense logging: ${error.message}`);
        return 'Sorry, there was an error trying to understand your message.';
    }
};

/**
 * Processes an incoming media message (image, audio).
 * Placeholder for future implementation with OCR/Transcription.
 */
export const processMediaMessage = async (user: IUser, mediaUrl: string, mediaContentType: string, messageSid: string): Promise<string> => {
    console.log(`Processing media message SID ${messageSid} for user ${user.phoneNumber}: ${mediaUrl} (${mediaContentType})`);

    if (mediaContentType.startsWith('image/')) {
        // TODO: Integrate with ocrService
        return 'Thanks for the image! Receipt scanning (OCR) is not implemented yet.';
    } else if (mediaContentType.startsWith('audio/')) {
        // TODO: Integrate with transcriptionService
        return 'Thanks for the voice note! Transcription is not implemented yet.';
    } else {
        return `Received media (${mediaContentType}), but I can only process images and audio for now.`;
    }
};

