import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clearspend',
    nodeEnv: process.env.NODE_ENV || 'development',
    externalApi: {
        messageUrl: process.env.MESSAGE_API_URL || 'https://monilm-clearspend.hf.space/message',
        extractExpenseUrl: process.env.EXTRACT_EXPENSE_API_URL || 'https://monilm-clearspend.hf.space/extract_expense'
    },
    nlp: {
        apiUrl: process.env.NLP_API_URL || 'https://monilm-clearspend.hf.space/nlp'
    },
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
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
    },
};

export default config;