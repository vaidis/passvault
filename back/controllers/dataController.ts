import { Request, Response } from 'express';
import { findData, deleteRow, editRow, addRow } from '../services/dataService';

export const getData = async (req: Request, res: Response): Promise<void> => {
  console.log('⚙️  dataController.ts > getData > req.user:', req.user);
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const response = await findData(req.user.username);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const deleteData = async (req: Request, res: Response): Promise<void> => {
  console.log('⚙️  dataController.ts > deleteData');
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    console.log('⚙️  dataController.ts > deleteData > user:', req.user.username);
    console.log('⚙️  dataController.ts > deleteData > id:', req.params.id);
    const response = await deleteRow(req.user.username, Number(req.params.id));
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const editData = async (req: Request, res: Response): Promise<void> => {
  const row = req.body;
  try {
    const response = await editRow(req.params.username, Number(req.params.rowId), row);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const addData = async (req: Request, res: Response): Promise<void> => {
  const row = req.body;
  const user = req.user;
  console.log('⚙️  dataController.ts > addData > row:', row);
  console.log('⚙️  dataController.ts > addData > user:', user);
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const response = await addRow(req.user.username, row);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

