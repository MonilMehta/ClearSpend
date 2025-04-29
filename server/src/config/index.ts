import dotenv from 'dotenv';

dotenv.config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/clearspend',
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    huggingFace: {
        apiKey: process.env.HUGGINGFACE_API_KEY,
    },
    tesseract: {
        lang: 'eng',
    },
    server: {
        port: process.env.PORT || 5000,
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
    },
};

export default config;