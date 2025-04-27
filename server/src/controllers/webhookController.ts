import { Request, Response } from 'express';
import twilio from 'twilio';
// import querystring from 'querystring'; // No longer needed here, parsed in middleware
import User from '../models/User'; // Import User model
import { processTextMessage, processMediaMessage } from '../services/messageProcessorService'; // Use the new service

const { MessagingResponse } = twilio.twiml;

class WebhookController {
    /**
     * Handles incoming Twilio messages (SMS/WhatsApp)
     */
    public async handleIncomingWebhook(req: Request, res: Response): Promise<void> {
        const twiml = new MessagingResponse();

        try {
            // The parsed body is now attached by the validation middleware
            const parsedBody = (req as any).parsedBody;
            if (!parsedBody) {
                console.error('Parsed body missing in handleIncomingWebhook (expected from validation middleware)');
                res.writeHead(500, { 'Content-Type': 'text/xml' });
                twiml.message('Error processing request. Body parsing failed.');
                res.end(twiml.toString());
                return;
            }

            const from = parsedBody.From as string; // Sender's phone number (e.g., whatsapp:+14155238886)
            const body = parsedBody.Body as string; // Text content
            const numMedia = parseInt(parsedBody.NumMedia as string || '0', 10);
            const messageSid = parsedBody.MessageSid as string;

            console.log(`Incoming validated message from ${from}: Body='${body}', NumMedia=${numMedia}, SID=${messageSid}`);

            // --- User Handling ---
            const standardizedPhoneNumber = from.startsWith('whatsapp:') ? from.substring(9) : from;

            let user = await User.findOne({ phoneNumber: standardizedPhoneNumber });
            if (!user) {
                console.log(`New user detected: ${standardizedPhoneNumber}. Creating user.`);
                // Add basic validation or default name if desired
                user = new User({ phoneNumber: standardizedPhoneNumber, name: 'New User' });
                await user.save();
            } else {
                 // Optional: Update user last seen or other info
                 user.updatedAt = new Date();
                 await user.save();
            }


            // --- Message Processing ---
            let responseMessage: string;

            if (numMedia > 0) {
                const mediaUrl = parsedBody.MediaUrl0 as string;
                const mediaContentType = parsedBody.MediaContentType0 as string;
                console.log(`Processing media: ${mediaUrl} (${mediaContentType})`);
                responseMessage = await processMediaMessage(user, mediaUrl, mediaContentType, messageSid);
            } else if (body) { // Ensure body is not empty
                responseMessage = await processTextMessage(user, body, messageSid);
            } else {
                // Handle cases like location messages or empty messages if necessary
                 console.log(`Received message SID ${messageSid} from ${from} with no text or media.`);
                 responseMessage = "Received empty message."; // Or handle differently
            }


            // --- Send Response ---
            twiml.message(responseMessage);
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());

        } catch (error: any) {
            console.error('Error handling incoming Twilio webhook:', error);
            twiml.message('Sorry, there was an error processing your request. Please try again later.');
            res.writeHead(500, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());
        }
    }

    /**
     * Handles Twilio status callbacks (e.g., message delivered, failed)
     */
    public handleStatusCallback(req: Request, res: Response): void {
        // Body is parsed by express.urlencoded in the route definition
        const messageSid = req.body.MessageSid;
        const messageStatus = req.body.MessageStatus;
        const errorCode = req.body.ErrorCode; // Useful for failures
        const errorMessage = req.body.ErrorMessage;

        console.log(`Status Callback: SID ${messageSid}, Status: ${messageStatus}${errorCode ? ', ErrorCode: ' + errorCode : ''}${errorMessage ? ', ErrorMessage: ' + errorMessage : ''}`);

        // TODO: Update message status in your database (e.g., find Expense by messageSid and update status)

        res.status(204).send(); // Respond with 204 No Content to acknowledge receipt
    }
}

export default new WebhookController();