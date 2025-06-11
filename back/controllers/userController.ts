import { Request, Response } from 'express';
import { getProfileData, setProfileData} from '../services/userService';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await getProfileData(req.params.username);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

export const setProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await setProfileData(req.params.username, req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
};

