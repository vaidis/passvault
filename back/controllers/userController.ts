import { Request, Response } from 'express';
import { findAllData } from '../services/userService';

export const getAllData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await findAllData(req.params.id);
    console.log('🐞 userController.ts > getAllData() req.cookies:', req.cookies);
    console.log('🐞 userController.ts > getAllData() response:', response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};
