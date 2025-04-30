import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';

if (!config.telegram.botToken) {
    console.warn('Telegram Bot Token is not configured. Telegram service will be disabled.');
    // Provide dummy functions or throw errors if called without a token
    // For simplicity, we'll let it potentially fail later if used without a token.
}

// Initialize the bot
// Polling is simpler for development, but webhooks are recommended for production.
// We will set up for webhooks, but won't start polling here.
const bot = new TelegramBot(config.telegram.botToken || '');

/**
 * Sends a message to a specific Telegram chat.
 * @param chatId The numeric chat ID to send the message to.
 * @param text The message text to send.
 */
export const sendTelegramMessage = async (chatId: number, text: string): Promise<void> => {
    if (!config.telegram.botToken) {
        console.error('Cannot send Telegram message: Bot Token is not configured.');
        return;
    }
    try {
        await bot.sendMessage(chatId, text);
        console.log(`Sent Telegram message to chat ID ${chatId}`);
    } catch (error: any) {
        console.error(`Error sending Telegram message to chat ID ${chatId}:`, error.response?.body || error.message);
        // Handle specific errors if needed (e.g., chat not found, bot blocked)
    }
};

/**
 * Sends a message asking the user to share their phone number via a button.
 * @param chatId The numeric chat ID to send the request to.
 */
export const requestContactInfo = async (chatId: number): Promise<void> => {
    if (!config.telegram.botToken) {
        console.error('Cannot request contact info: Bot Token is not configured.');
        return;
    }
    try {
        const opts: TelegramBot.SendMessageOptions = {
            reply_markup: {
                keyboard: [
                    [{
                        text: 'Share Phone Number',
                        request_contact: true, // This creates the special button
                    }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true, // Hide keyboard after use
            },
        };
        await bot.sendMessage(chatId, 'To link your account, please share your phone number using the button below.', opts);
        console.log(`Requested contact info from chat ID ${chatId}`);
    } catch (error: any) {
        console.error(`Error requesting contact info from chat ID ${chatId}:`, error.message);
    }
};

/**
 * Sets the webhook for the Telegram bot.
 * Should be called once during application startup.
 * @param webhookUrl The publicly accessible URL for your webhook endpoint (e.g., https://your-app.com/api/webhook/telegram)
 */
export const setTelegramWebhook = async (webhookUrl: string): Promise<void> => {
    if (!config.telegram.botToken) {
        console.error('Cannot set Telegram webhook: Bot Token is not configured.');
        return;
    }
    try {
        // Construct the full webhook URL, potentially adding a secret token path
        const fullWebhookUrl = config.telegram.webhookSecret
            ? `${webhookUrl}/${config.telegram.webhookSecret}`
            : webhookUrl;

        await bot.setWebHook(fullWebhookUrl);
        console.log(`Telegram webhook set successfully to: ${fullWebhookUrl}`);

        // Optional: Get webhook info to confirm
        const info = await bot.getWebHookInfo();
        console.log('Telegram Webhook Info:', info);

    } catch (error: any) {
        console.error(`Error setting Telegram webhook to ${webhookUrl}:`, error.message);
    }
};

/**
 * Processes an incoming update object from the Telegram webhook.
 * Identifies regular messages and contact sharing messages.
 * @param update The update object received from Telegram.
 * @returns TelegramBot.Message | null The relevant message object if found, otherwise null.
 */
export const processTelegramUpdate = (update: any): TelegramBot.Message | null => {
    // Basic validation
    if (!update) {
        console.warn('Received empty Telegram update.');
        return null;
    }

    // Log the received update for debugging
    // console.log('Received Telegram Update:', JSON.stringify(update, null, 2));

    // Check for a message (could be text, audio, photo, contact, etc.)
    if (update.message) {
        // Specifically check if the message contains contact information
        if (update.message.contact) {
            console.log(`Received contact information from chat ID ${update.message.chat.id}`);
            // The message object itself contains the contact details
            return update.message;
        }
        // Handle other message types (text, audio, photo)
        // We assume non-contact messages are for expense processing etc.
        // You might want more specific checks here later (e.g., message.text, message.photo)
        return update.message;
    }

    // Handle other update types if needed (callback queries, inline queries, etc.)
    // console.log('Ignoring non-message update type:', Object.keys(update));
    return null;
};

/**
 * Downloads a file sent to the bot.
 * @param fileId The file_id provided by Telegram.
 * @param downloadPath The local path to save the downloaded file.
 * @returns Promise<string> The path where the file was downloaded.
 */
export const downloadTelegramFile = async (fileId: string, downloadPath: string): Promise<string> => {
    if (!config.telegram.botToken) {
        throw new Error('Cannot download Telegram file: Bot Token is not configured.');
    }
    try {
        const filePath = await bot.downloadFile(fileId, downloadPath);
        console.log(`Downloaded Telegram file ${fileId} to ${filePath}`);
        return filePath; // downloadFile returns the path it saved to
    } catch (error: any) {
        console.error(`Error downloading Telegram file ${fileId}:`, error.message);
        throw new Error(`Failed to download Telegram file: ${error.message}`);
    }
};

// Export the bot instance if direct access is needed elsewhere (use with caution)
// export { bot };
