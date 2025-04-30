import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors
import dotenv from 'dotenv'; // Import dotenv
import ExpenseController from './controllers/expenseController';
dotenv.config(); // Load environment variables from .env file

import expenseRoutes from './routes/expenseRoutes';
import webhookRoutes from './routes/webhookRoutes';
// import authRoutes from './routes/authRoutes'; // Prepare for auth routes
import { config } from './config'; // Ensure config loads after dotenv

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(bodyParser.json());
// Twilio webhook requires raw body for validation, handle it in the webhook route specifically
// app.use(bodyParser.urlencoded({ extended: true })); // Keep urlencoded for standard forms if needed

// Routes
router.post('/expenses', ExpenseController.createExpense);
router.get('/expenses', ExpenseController.getExpenses);
router.get('/stats', ExpenseController.getStats); // Stats are user-specific now
router.get('/expenses/:id', ExpenseController.getExpenseById);
router.put('/expenses/:id', ExpenseController.updateExpense);
router.delete('/expenses/:id', ExpenseController.deleteExpense);

// Basic Error Handling (Example - can be expanded)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri, {
    // Remove deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
});