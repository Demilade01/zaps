import { Request, Response, NextFunction } from 'express';

export const getMerchant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Logic to fetch merchant details
        res.status(200).json({ message: 'Merchant details fetched (skeletal)' });
    } catch (error) {
        next(error);
    }
};

export const onboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Logic for merchant onboarding
        res.status(201).json({ message: 'Merchant onboarded (skeletal)' });
    } catch (error) {
        next(error);
    }
};
