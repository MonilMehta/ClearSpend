import { google, Auth, sheets_v4 } from 'googleapis';
import { config } from '../config';
import path from 'path';

class GoogleSheetsService {
    private sheets: sheets_v4.Sheets;
    private auth: Auth.GoogleAuth;

    constructor() {
        // TODO: Set up Google Cloud credentials (Service Account recommended)
        // 1. Create a Service Account in Google Cloud Console.
        // 2. Enable the Google Sheets API.
        // 3. Download the service account key file (JSON).
        // 4. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of the key file.
        //    or load it explicitly here.

        // Example using Application Default Credentials (ADC) via env var:
        this.auth = new google.auth.GoogleAuth({
            // keyFile: path.join(__dirname, '../../credentials.json'), // Or load key explicitly
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }

    async createSpreadsheet(title: string): Promise<string | null | undefined> {
        try {
            const spreadsheet = await this.sheets.spreadsheets.create({
                requestBody: {
                    properties: {
                        title: title,
                    },
                    sheets: [
                        { properties: { title: 'Expenses' } } // Add an initial sheet
                    ]
                },
            });
            console.log(`Created spreadsheet with ID: ${spreadsheet.data.spreadsheetId}`);
            // TODO: Consider setting permissions (e.g., share with user if email known)
            return spreadsheet.data.spreadsheetId;
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            throw new Error('Could not create Google Sheet.');
        }
    }

    async appendData(spreadsheetId: string, range: string, values: any[][]): Promise<sheets_v4.Schema$AppendValuesResponse | undefined> {
        try {
            const result = await this.sheets.spreadsheets.values.append({
                spreadsheetId,
                range, // e.g., 'Expenses!A1'
                valueInputOption: 'USER_ENTERED', // or 'RAW'
                requestBody: {
                    values: values,
                },
            });
            console.log(`${result.data.updates?.updatedCells} cells appended.`);
            return result.data;
        } catch (error) {
            console.error('Error appending data to spreadsheet:', error);
            throw new Error('Could not append data to Google Sheet.');
        }
    }

    // TODO: Add methods for reading data, formatting, etc. if needed
}

export default new GoogleSheetsService();
