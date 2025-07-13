import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expenseRoutes';
import webhookRoutes from './routes/webhookRoutes';
import config from './config';
import prisma from './config/database';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/webhooks', webhookRoutes);

// Basic Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Test database connection and start server
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

startServer(); 