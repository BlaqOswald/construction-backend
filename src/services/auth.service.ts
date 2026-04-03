import { pool } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/**
 * REGISTER USER
 */
export const registerUser = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)
     RETURNING id, email, role`,
    [email, hashed]
  );

  return result.rows[0];
};

/**
 * LOGIN USER
 */
export const loginUser = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
