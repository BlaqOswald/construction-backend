import { Request, Response } from "express";
import * as service from "./users.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await service.createUser(req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    res.json(await service.getUsers());
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const setPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await service.setPassword(
      email,
      password
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};