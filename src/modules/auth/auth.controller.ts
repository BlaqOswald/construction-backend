import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as service from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await service.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // 🔥 IMPORTANT
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};
