import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config'; // Assuming config holds the URLs

// Define the base URLs for the external APIs
// It's better to get these from config/environment variables
const MESSAGE_API_URL = process.env.MESSAGE_API_URL || config.externalApi?.messageUrl || 'https://monilm-clearspend.hf.space/message';
const EXTRACT_EXPENSE_API_URL = process.env.EXTRACT_EXPENSE_API_URL || config.externalApi?.extractExpenseUrl || 'https://monilm-clearspend.hf.space/extract_expense';
// Note: No direct audio API call here as per refined plan (Whisper first, then message API)

if (!MESSAGE_API_URL) {
    console.warn('MESSAGE_API_URL is not defined. Calls to the message API will fail.');
}
if (!EXTRACT_EXPENSE_API_URL) {
    console.warn('EXTRACT_EXPENSE_API_URL is not defined. Calls to the expense extraction API will fail.');
}

/**
 * Sends text to the external /message API.
 * @param text The text message to send.
 * @returns Promise<any> The response data from the API.
 */
export const sendMessageApi = async (text: string): Promise<any> => {
    if (!MESSAGE_API_URL) {
        throw new Error('Message API Service is not configured.');
    }

    try {
        console.log(`Calling Message API at ${MESSAGE_API_URL} with text: "${text}"`);
        const response = await axios.post(MESSAGE_API_URL, { text: text }); // Assuming JSON payload { "text": "..." }

        console.log('Message API Response:', response.data);
        return response.data; // Return the response data

    } catch (error: any) {
        console.error(`Error calling Message API: ${error.message}`, error.response?.data || '');
        // Re-throw or return a specific error structure
        throw new Error(`Failed to process text with Message API: ${error.message}`);
    }
};

/**
 * Sends an image file to the external /extract_expense API.
 * @param imagePath The local path to the image file.
 * @returns Promise<any> The response data from the API.
 */
export const sendImageForExpenseExtractionApi = async (imagePath: string): Promise<any> => {
    if (!EXTRACT_EXPENSE_API_URL) {
        throw new Error('Expense Extraction API Service is not configured.');
    }
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found at path: ${imagePath}`);
    }

    const form = new FormData();
    // Ensure the field name 'file' matches what the Hugging Face endpoint expects
    form.append('file', fs.createReadStream(imagePath));

    try {
        console.log(`Calling Extract Expense API at ${EXTRACT_EXPENSE_API_URL} with image: ${imagePath}`);
        const response = await axios.post(EXTRACT_EXPENSE_API_URL, form, {
            headers: {
                ...form.getHeaders(), // Important for multipart/form-data
            },
        });

        console.log('Extract Expense API Response:', response.data);
        return response.data; // Return the response data

    } catch (error: any) {
        console.error(`Error calling Extract Expense API: ${error.message}`, error.response?.data || '');
        // Re-throw or return a specific error structure
        throw new Error(`Failed to process image with Extract Expense API: ${error.message}`);
    }
};
