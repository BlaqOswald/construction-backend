import { Request, Response } from "express";
import * as authService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    return res.json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(401).json({
      message: error.message,
    });
  }
};