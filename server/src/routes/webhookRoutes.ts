import express, { Router } from 'express';
import webhookController from '../controllers/webhookController'; // Import default export
import { validateTwilioRequest } from '../middlewares/validationMiddleware';

const router = Router();

// Twilio requires the raw body for validation
// Apply raw body parser ONLY to the incoming webhook route
router.post(
    '/twilio/incoming', // Corrected path
    express.raw({ type: 'application/x-www-form-urlencoded' }), // Parse raw body first
    validateTwilioRequest, // Then validate the request
    webhookController.handleIncomingWebhook // Use instance method
);

// Route for status callbacks (doesn't necessarily need raw body parsing unless validating)
router.post(
    '/twilio/status', // Corrected path
    express.urlencoded({ extended: true }), // Use standard urlencoded parser for status
    webhookController.handleStatusCallback // Use instance method
);

export default router;