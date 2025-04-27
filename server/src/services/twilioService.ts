import { Client } from 'twilio';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = new Client(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendWhatsAppMessage = async (to: string, message: string): Promise<void> => {
    try {
        await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
            body: message,
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw new Error('Failed to send message');
    }
};

export const handleIncomingMessage = async (req: Request, res: Response): Promise<void> => {
    const { From, Body } = req.body;

    // Process the incoming message (e.g., save to database, trigger other services)
    console.log(`Received message from ${From}: ${Body}`);

    // Respond to the sender
    await sendWhatsAppMessage(From, 'Thank you for your message! We will process it shortly.');

    res.status(200).send('Message processed');
};