const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const ExpenseController = require('./src/controllers/expenseController');
dotenv.config();

const expenseRoutes = require('./src/routes/expenseRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');
// const authRoutes = require('./routes/authRoutes'); // Prepare for auth routes
const config = require('./src/config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/webhooks', webhookRoutes);
// app.use('/api/auth', authRoutes);

// Basic Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }); 