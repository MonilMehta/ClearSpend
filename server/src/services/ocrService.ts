import Tesseract from 'tesseract.js';

export const processImage = async (imagePath: string): Promise<string> => {
    try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            logger: info => console.log(info) // Optional: log progress
        });
        return text;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('OCR processing failed');
    }
};