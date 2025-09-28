// ping.route.ts
import type { Request, Response } from "express";
import express from "express";

export const pingRouter = express.Router();

export const getPing = async (req: Request, res: Response): Promise<void> => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.status(204).end();
};

