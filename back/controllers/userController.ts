import { Request, Response } from 'express';
import { findAllData } from '../services/userService';

export const getAllData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await findAllData(req.params.id);
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};
