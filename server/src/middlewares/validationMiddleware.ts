import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { config } from '../config'; // Import config

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    console.error('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) are missing in .env');
    // Depending on the setup, you might want to throw an error or exit
}

export const validateExpense = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('category').isString().withMessage('Category must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateTwilioRequest = (req: Request, res: Response, next: NextFunction) => {
    // Ensure TWILIO_AUTH_TOKEN is loaded
    const authToken = process.env.TWILIO_AUTH_TOKEN || config.twilio.authToken;
    if (!authToken) {
        console.error('Twilio Auth Token not configured.');
        return res.status(500).send('Internal Server Error: Twilio configuration missing.');
    }

    // Get the signature from the header
    const twilioSignature = req.header('X-Twilio-Signature');

    // Get the full URL of the request
    // Note: Construct the URL carefully, considering potential proxies (X-Forwarded-Proto)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = protocol + '://' + req.get('host') + req.originalUrl;

    // Get the raw body (assuming express.raw middleware placed it in req.body)
    // Twilio validation requires the raw, unparsed body
    const rawBody = (req as any).body; // express.raw puts buffer here if no other parser ran

    if (!twilioSignature || !rawBody) {
        console.warn('Twilio validation failed: Missing signature or raw body.');
        return res.status(400).send('Bad Request: Missing Twilio signature or body.');
    }

    // Prepare parameters for validation - Twilio expects POST params from the raw body
    // If the rawBody is a Buffer, convert it to string to parse
    const bodyString = rawBody instanceof Buffer ? rawBody.toString('utf-8') : rawBody;
    // Twilio's helper needs the POST params as an object.
    // Since the raw body *is* the urlencoded string, we don't need to re-parse it here
    // IF express.raw was used. If bodyParser.urlencoded was used globally first,
    // req.body would be parsed, and we'd need the raw body from elsewhere (e.g., a custom middleware).
    // Assuming express.raw({ type: '...' }) was used ONLY on this route:
    const requestParams = {}; // The helper function handles parsing the raw body string itself if needed.

    // Validate the request
    const isValid = twilio.validateRequest(
        authToken,
        twilioSignature,
        fullUrl,
        requestParams // Pass empty object; the helper uses the raw body implicitly if needed or parses if string. Check twilio-node docs for specifics.
        // For twilio-node v3, it might expect the parsed body here if not using validateExpressRequest
        // Let's try validateExpressRequest which is simpler
    );

     // Alternative using validateExpressRequest (simpler, handles body parsing differences)
     const isValidExpress = twilio.validateExpressRequest(req, authToken, { url: fullUrl });


    if (isValidExpress) {
        // If valid, parse the raw body for the *next* middleware (the controller)
        // We need to attach the parsed body somewhere standard, like req.parsedBody
        try {
            const querystring = require('querystring');
            (req as any).parsedBody = querystring.parse(bodyString);
        } catch (parseError) {
            console.error('Error parsing raw body after validation:', parseError);
            return res.status(500).send('Internal Server Error: Could not parse request body.');
        }
        next(); // Proceed to the controller
    } else {
        console.warn(`Twilio validation failed for URL: ${fullUrl}`);
        return res.status(403).send('Forbidden: Invalid Twilio signature.');
    }
};