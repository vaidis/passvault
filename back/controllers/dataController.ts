import { Request, Response } from 'express';
import { findData, deleteRow, editRow, newRow } from '../services/dataService';

export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await findData(req.params.username);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const deleteData = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await deleteRow(req.params.username, Number(req.params.row));
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

export const newData = async (req: Request, res: Response): Promise<void> => {
  const row = req.body;
  try {
    const response = await newRow(req.params.username, row);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

