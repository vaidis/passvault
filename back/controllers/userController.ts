import { Request, Response } from 'express';
import { findAllData, deleteRow} from '../services/userService';

export const getAllData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await findAllData(req.params.id);
    //console.log('⚙️  userController.ts > getAllData() req.cookies:', req.cookies);
    //console.log('⚙️  userController.ts > getAllData() response:', response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const deleteData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await deleteRow(req.params.id, Number(req.params.row));
    console.log('⚙️  userController.ts > deleteRow() req.cookies:', req.cookies);
    console.log('⚙️  userController.ts > deleteRow() response:', response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};




