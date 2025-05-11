import twilio from 'twilio';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

export const downloadMedia = async (mediaUrl: string): Promise<string> => {
    try {
        // Create a temporary file path
        const tempDir = os.tmpdir();
        const fileName = `media_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const filePath = path.join(tempDir, fileName);

        // Download the file
        const response = await axios({
            method: 'GET',
            url: mediaUrl,
            responseType: 'stream'
        });

        // Save the file
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading media:', error);
        throw new Error('Failed to download media file');
    }
};
