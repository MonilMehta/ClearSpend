import { Request, Response } from 'express';
import User from '../models/User';

class LimitController {
    async updateLimit(req: Request, res: Response) {
        try {
            const { userId } = req.params; // Get userId from route params for now
            const { monthlyLimit } = req.body;

            if (typeof monthlyLimit !== 'number' || monthlyLimit < 0) {
                return res.status(400).json({ message: 'Invalid monthly limit value' });
            }

            // In a real app, get authenticated user ID instead of from params
            const user = await User.findByIdAndUpdate(
                userId,
                { monthlyLimit },
                { new: true, runValidators: true } // Return updated doc, run schema validators
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Limit updated successfully', monthlyLimit: user.monthlyLimit });
        } catch (error) {
            res.status(500).json({ message: 'Error updating limit', error });
        }
    }
}

export default new LimitController();
