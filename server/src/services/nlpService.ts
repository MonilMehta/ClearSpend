import axios from 'axios';
import  config  from '../config'; // To get API URLs
import { CATEGORIES } from '../constants/categories';

// Define interfaces for clarity (matching the expected API response)
export interface NlpResult {
    intent: Intent;
    entities: Entities;
    originalMessage: string;
}

export type Intent =
    | 'add_expense'
    | 'get_report'
    | 'set_limit'
    | 'greeting'
    | 'unknown';

export interface Entities {
    amount?: number;
    category?: string;
    description?: string;
    limitAmount?: number;
    timeframe?: string;
    potentialCategoryKeywords?: string[];
}

// Get the NLP API URL from environment variables or config
const NLP_API_URL = process.env.NLP_API_URL || config.nlp?.apiUrl;

if (!NLP_API_URL) {
    console.warn('NLP_API_URL is not defined in environment variables or config. NLP service calls will fail.');
}

/**
 * Calls the external NLP API to process a message.
 * @param message The user's text message.
 * @returns Promise<NlpResult> The processed NLP result from the API.
 */
export const processNlp = async (message: string): Promise<NlpResult> => {
    if (!NLP_API_URL) {
        throw new Error('NLP Service is not configured.');
    }

    try {
        console.log(`Calling NLP API at ${NLP_API_URL} for message: "${message}"`);
        const response = await axios.post<NlpResult>(NLP_API_URL, {
            message: message,
            // You might need to pass other context like userId or categories here
            // depending on your NLP API's requirements.
            // categories: CATEGORIES // Example if API needs categories
        });

        // Basic validation of the response structure
        if (!response.data || typeof response.data.intent !== 'string' || typeof response.data.entities !== 'object') {
            console.error('Invalid response structure from NLP API:', response.data);
            throw new Error('Invalid response structure from NLP API.');
        }

        console.log('NLP API Response:', response.data);
        return response.data;

    } catch (error: any) {
        console.error(`Error calling NLP API: ${error.message}`, error.response?.data || '');
        // Return a default unknown state or re-throw depending on desired handling
        // Returning a default allows the bot to say "I didn't understand"
        return {
            intent: 'unknown',
            entities: {},
            originalMessage: message,
        };
        // Or re-throw: throw new Error(`Failed to process message with NLP API: ${error.message}`);
    }
};

// Remove or comment out the previous from-scratch implementation
/*
// ... previous implementation ...
*/