import { Request, Response } from "express";
import * as service from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await service.registerUser(email, password);

    res.status(201).json(user);
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Registration failed", error });
}
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await service.loginUser(email, password);

    res.json(data);
  } catch (error) {
    res.status(401).json({ message: "Login failed" });
  }
};
