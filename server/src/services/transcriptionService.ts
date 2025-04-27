import { Whisper } from '@huggingface/transformers';

const whisper = new Whisper();

export const transcribeVoiceNote = async (audioBuffer: Buffer): Promise<string> => {
    try {
        const transcription = await whisper.transcribe(audioBuffer);
        return transcription.text;
    } catch (error) {
        console.error('Error transcribing voice note:', error);
        throw new Error('Transcription failed');
    }
};