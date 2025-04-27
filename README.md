# ClearSpend - WhatsApp-Based Expense Tracker

ClearSpend is an innovative expense tracking application that allows users to manage their finances directly through WhatsApp. By leveraging the power of AI and various technologies, ClearSpend provides a seamless experience for tracking and categorizing expenses.

## Features

- **WhatsApp Integration**: Users can send messages, photos of bills, and voice notes to track their expenses.
- **Natural Language Processing**: Understands user inputs in natural language for easy expense entry.
- **Optical Character Recognition (OCR)**: Automatically scans and parses bill images to extract expense details.
- **Voice Transcription**: Converts voice notes into text for expense tracking.
- **Visual Insights**: Provides a clean dashboard to visualize spending trends and category breakdowns.
- **No App Required**: Users can interact with the service directly through WhatsApp without needing to download an additional app.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Messaging**: Twilio WhatsApp API
- **NLP**: HuggingFace Transformers
- **OCR**: Tesseract.js
- **Voice-to-Text**: HuggingFace Whisper

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account for database
- Twilio account for WhatsApp API access

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd clearspend
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   ```

4. Set up environment variables for Twilio and MongoDB in both the client and server directories.

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:3000`.

## Future Plans

- Implement webhook to generate PDF expense summaries.
- Integrate Google Sheets export functionality.
- Create a public URL for the dashboard with authentication.
- Add a personal finance GPT assistant for enhanced user interaction.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.