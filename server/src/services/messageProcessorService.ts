import { IUser } from '../models/User';
// Use the new external API service for processing
import { processAudioInputAndSend, sendImageForExpenseExtraction } from './externalApiService';
// Keep NLP service for text processing fallback or direct text commands
import { processNlp } from './nlpService'; // Renamed from classifyExpense/extractIntent
import { sendWhatsAppMessage, downloadMedia } from './twilioService'; // To send replies
import prisma from '../config/database'; // Import Prisma client
import { Decimal } from '@prisma/client/runtime/library';
import { CATEGORIES } from '../constants/categories'; // Import categories
import fs from 'fs'; // Needed for potential temp file handling
import os from 'os';
import path from 'path';

// Placeholder for more complex state management if needed (e.g., Redis)
const userState: { [key: string]: { lastIntent: string, expecting?: string } } = {};

/**
 * Processes an incoming text message from a user.
 * Determines intent, extracts information, interacts with other services, and returns a response.
 */
export const processTextMessage = async (user: IUser, message: string, messageSid: string): Promise<string> => {
    console.log(`Processing text message SID ${messageSid} for user ${user.phoneNumber}: "${message}"`);

    // --- Use NLP Service --- (Updated to use processNlp)
    try {
        const nlpResult = await processNlp(message);
        console.log('NLP Result:', nlpResult);

        switch (nlpResult.intent) {
            case 'add_expense':
                if (nlpResult.entities.amount) {
                    const amount = nlpResult.entities.amount;
                    // Use NLP category or fallback
                    const category = nlpResult.entities.category || 'Uncategorized';
                    const description = nlpResult.entities.description || message;

                    // Save the expense
                    const newExpense = await prisma.expense.create({
                        data: {
                            userId: user.id,
                            amount: new Decimal(amount),
                            category: category,
                            description: description,
                            date: new Date(), // Use current date for now
                        }
                    });
                    
                    return `✅ Logged: ${amount.toFixed(2)} for ${description} (Category: ${category}).`;
                } else {
                    return "Okay, I see you want to add an expense, but I couldn't find the amount. Can you please include it?";
                }

            case 'get_report':
                // TODO: Implement report generation
                return 'Report generation is not implemented yet.';

            case 'set_limit':
                // TODO: Implement limit setting
                return 'Setting spending limits is not implemented yet.';

            case 'greeting':
                return `Hi ${user.name || 'there'}! How can I help you track your spending today?`;

            case 'unknown':
            default:
                return "Sorry, I didn't understand that. You can tell me about expenses like 'Paid $10 for coffee' or ask for a 'report'.";
        }

    } catch (error: any) {
        console.error(`Error processing message via NLP: ${error.message}`);
        return 'Sorry, there was an error trying to understand your message.';
    }
};

/**
 * Processes an incoming media message (image, audio).
 * Downloads the media, then sends to appropriate external service.
 */
export const processMediaMessage = async (user: IUser, mediaUrl: string, mediaContentType: string, messageSid: string): Promise<string> => {
    console.log(`Processing media message SID ${messageSid} for user ${user.phoneNumber}: ${mediaUrl} (${mediaContentType})`);

    let localFilePath: string | null = null;
    try {
        // Download the media file
        localFilePath = await downloadMedia(mediaUrl);
        if (!localFilePath) {
            throw new Error('Failed to download media.');
        }
        console.log(`Media downloaded to: ${localFilePath}`);

        let apiResponse: any = null; // Use a more specific type if possible
        let replyMessage = "";

        // Process based on content type
        if (mediaContentType.startsWith('image/')) {
            console.log('Sending image to /extract_expense API...');
            apiResponse = await sendImageForExpenseExtraction(localFilePath);
            
            // Process the image response and create expense if successful
            if (apiResponse && apiResponse.success) {
                const { amount, category, description } = apiResponse.expense || {};
                
                if (amount) {
                    const newExpense = await prisma.expense.create({
                        data: {
                            userId: user.id,
                            amount: new Decimal(amount),
                            category: category || 'Receipt',
                            description: description || 'Expense from receipt',
                            date: new Date(),
                        }
                    });
                    
                    replyMessage = `✅ Receipt processed! Logged: $${amount} for ${description} (Category: ${category || 'Receipt'})`;
                } else {
                    replyMessage = `📄 I can see this is a receipt, but I couldn't extract the expense details. Can you tell me the amount manually?`;
                }
            } else {
                replyMessage = apiResponse?.message || 'Could not process the receipt. Please try again or enter the expense manually.';
            }

        } else if (mediaContentType.startsWith('audio/')) {
            console.log('Processing audio via Whisper and /message API...');
            apiResponse = await processAudioInputAndSend(localFilePath);
            
            // Process audio response - should contain transcribed text and expense info
            if (apiResponse && apiResponse.success) {
                const { amount, category, description, transcription } = apiResponse;
                
                if (amount) {
                    const newExpense = await prisma.expense.create({
                        data: {
                            userId: user.id,
                            amount: new Decimal(amount),
                            category: category || 'Voice Note',
                            description: description || transcription || 'Voice expense',
                            date: new Date(),
                        }
                    });
                    
                    replyMessage = `🎤 Voice message processed! Logged: $${amount} for ${description} (Category: ${category || 'Voice Note'})`;
                } else {
                    replyMessage = `🎤 I heard: "${apiResponse.transcription || 'unclear audio'}" but couldn't find expense details. Can you clarify the amount?`;
                }
            } else {
                replyMessage = apiResponse?.message || 'Could not process the audio. Please try again or type your expense.';
            }

        } else {
            replyMessage = `Received media (${mediaContentType}), but I can only process images and audio for now.`;
        }

        return replyMessage;

    } catch (error: any) {
        console.error(`Error processing media message SID ${messageSid}: ${error.message}`);
        return 'Sorry, there was an error processing the media file.';
    } finally {
        // Clean up the downloaded file
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log(`Cleaned up temporary file: ${localFilePath}`);
            } catch (cleanupError) {
                console.error(`Error cleaning up temporary file ${localFilePath}: ${cleanupError}`);
            }
        }
    }
};

