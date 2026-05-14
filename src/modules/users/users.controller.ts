import { Request, Response } from "express";
import * as service from "./users.service";

export const createUser = (req: Request, res: Response) => {
  try {
    const user = service.createUser(req.body);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUsers = (req: Request, res: Response) => {
  try {
    res.json(service.getUsers());
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