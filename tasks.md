# Project Tasks

This document outlines the tasks required to build the ClearSpend application.

## Backend (Node.js/Express)

-   [x] **Setup & Base:**
    -   [x] Initialize Node.js project (`npm init`).
    -   [x] Install necessary dependencies (Express, Twilio SDK, dotenv, database ORM/client, etc.).
    -   [x] Set up Express server (`server.ts`).
    -   [x] Configure environment variables (`.env`) for credentials (Twilio, Database, Google, Telegram).
    -   [x] Implement basic error handling middleware.
    -   [x] Set up database connection (e.g., MongoDB with Mongoose, PostgreSQL with Prisma/Sequelize).
-   [x] **Twilio Webhook Handling:**
    -   [x] Create webhook endpoint (`/api/twilio/incoming`) to receive messages (POST).
    -   [x] Create webhook endpoint (`/api/twilio/status`) for status callbacks (POST).
    -   [x] Validate Twilio requests using `twilio.webhook`.
    -   [x] Parse incoming message content (link with `nlpService.ts`, `ocrService.ts`, `transcriptionService.ts`).
    -   [x] Implement logic to process commands (e.g., "report", "add expense", "set limit").
    -   [x] Store relevant message data and user interactions in the database.
-   [x] **Telegram Bot Handling:**
    -   [x] Set up Telegram Bot using a library (e.g., `node-telegram-bot-api`).
    -   [x] Create webhook endpoint (`/api/telegram/incoming`) or use polling to receive messages.
    -   [x] Validate Telegram requests (if using webhooks).
    -   [x] Parse incoming messages and commands.
    -   [x] Implement logic mirroring WhatsApp commands.
    -   [x] Link Telegram user ID with phone number for cross-platform state.
-   [x] **User Authentication & Management:**
    -   [x] Implement user registration/login API (`/api/auth/login`, `/api/auth/register`).
    -   [x] Use JWT or session-based authentication for the dashboard.
    -   [x] Define User schema/model (including phone number, linked accounts, limits, etc.).
    -   [x] Associate incoming messages (Twilio/Telegram) with registered users based on phone number.
-   [x] **Core Features API:**
    -   [x] API endpoint to fetch user spending data (`/api/expenses`).
    -   [x] API endpoint to fetch user statistics (`/api/stats`).
    -   [x] API endpoint to set/update spending limits (`/api/limits`).
    -   [x] API endpoint to manage linked accounts (Google Sheets).
-   [x] **Database Models:**
    -   [x] User model.
    -   [x] Expense model (link to user, amount, category, description, date, source platform).
    -   [ ] Message Log model (optional, for debugging).
-   [x] **Services:**
    -   [x] Refine `nlpService.ts` for command parsing.
    -   [ ] Refine `ocrService.ts` if image processing is needed.
    -   [x] Refine `transcriptionService.ts` if voice messages are handled.
    -   [x] Implement `googleSheetsService.ts`.
    -   [x] Implement `telegramService.ts`.

## Frontend (Next.js)

-   [ ] **Setup & Base:**
    -   [ ] Ensure Next.js project is set up correctly.
    -   [ ] Configure Tailwind CSS (if not already done via `create-next-app`).
    -   [ ] Set up state management (e.g., Zustand, Redux Toolkit, Context API).
    -   [ ] Set up routing.
-   [ ] **Landing Page (`/`):**
    -   [ ] Create a simple, informative landing page.
    -   [ ] Include a section explaining the service.
    -   [ ] Add a QR code linking to the WhatsApp Twilio Sandbox (`https://wa.me/<YOUR_TWILIO_NUMBER>?text=join%20<YOUR_SANDBOX_KEYWORD>`). Fetch number/keyword dynamically if possible or configure via env vars.
    -   [ ] Link to the Login page.
-   [ ] **Authentication Pages:**
    -   [ ] Create Login page (`/login`).
    -   [ ] Create Registration page (`/register`) (optional, depending on flow).
    -   [ ] Implement forms for login/registration.
    -   [ ] Handle API calls to backend auth endpoints.
    -   [ ] Implement protected routes for the dashboard.
-   [ ] **Dashboard (`/dashboard`):**
    -   [ ] Create main dashboard layout.
    -   [ ] **Stats Display:**
        -   [ ] Component to fetch and display spending statistics (charts, summaries).
    -   [ ] **Expense Tracking:**
        -   [ ] Component to display list/table of recent expenses.
        -   [ ] Filtering/sorting options for expenses.
    -   [ ] **Limit Management:**
        -   [ ] Component to view and update spending limits.
        -   [ ] Form to submit limit changes to the backend.
    -   [ ] **Integrations Management:**
        -   [ ] Section to connect/disconnect Google Sheets.
-   [ ] **Dynamic Linking Handling:**
    -   [ ] Set up deep linking or specific routes (e.g., `/dashboard/reports`) that can be triggered from messages.
    -   [ ] Determine mechanism (e.g., backend sends a specific URL in response to "report" command).
-   [ ] **UI/UX:**
    -   [ ] Ensure responsive design.
    -   [ ] Implement clear navigation.
    -   [ ] Add loading states and error handling for API calls.

## Twilio Setup

-   [ ] **Account:**
    -   [ ] Create a Twilio account.
    -   [ ] Obtain Account SID and Auth Token.
    -   [ ] Purchase or configure a Twilio phone number capable of SMS/WhatsApp.
-   [ ] **WhatsApp Sandbox (for Development):**
    -   [ ] Set up the Twilio Sandbox for WhatsApp.
    -   [ ] Note the Sandbox phone number and join keyword.
    -   [ ] Configure the Sandbox webhook URL to point to your development backend (`ngrok` or similar needed for local dev):
        -   **WHEN A MESSAGE COMES IN:** `https://<your_dev_url>/api/twilio/incoming` (Method: POST)
        -   **STATUS CALLBACK URL:** `https://<your_dev_url>/api/twilio/status` (Method: POST)
-   [ ] **Production Configuration (Post-Sandbox):**
    -   [ ] Register for a WhatsApp Business Profile (if moving beyond Sandbox).
    -   [ ] Configure the purchased Twilio number's Messaging Service:
        -   **Incoming Messages Webhook:** `https://<your_prod_url>/api/twilio/incoming` (Method: POST)
        -   **Status Callback URL:** `https://<your_prod_url>/api/twilio/status` (Method: POST)

## Integrations

-   [ ] **Google Sheets:**
    -   [ ] Set up Google Cloud Project and enable Sheets API.
    -   [ ] Obtain API credentials (API Key or OAuth 2.0 Client ID/Secret).
    -   [ ] Implement backend service (`googleSheetsService.ts`) to read/write data.
    -   [ ] Handle OAuth flow for user authorization if needed.

## Cross-Platform State Management

-   [ ] **User Identification:**
    -   [ ] Use the phone number as the primary key to link user accounts across platforms.
    -   [ ] Store Telegram User ID alongside the phone number in the User model upon first interaction or linking.
-   [ ] **Session/Context:**
    -   [ ] Design a mechanism (in-memory store like Redis, or database field) to hold temporary user state if needed for multi-step commands (e.g., "add expense" -> "what amount?").
    -   [ ] Ensure state is accessible regardless of whether the next message comes from WhatsApp or Telegram (using the phone number lookup).

## Deployment

-   [ ] **Backend:**
    -   [ ] Choose hosting platform (e.g., Vercel Serverless Functions, Render, Fly.io, AWS).
    -   [ ] Set up CI/CD pipeline.
    -   [ ] Configure production environment variables.
-   [ ] **Frontend:**
    -   [ ] Choose hosting platform (e.g., Vercel, Netlify).
    -   [ ] Set up CI/CD pipeline.
    -   [ ] Configure production environment variables (e.g., backend API URL).
-   [ ] **Database:**
    -   [ ] Provision managed database service (e.g., MongoDB Atlas, Neon, Supabase Postgres).
