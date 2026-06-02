import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  // FIRST LOGIN TEMP PASSWORD FLOW (KEEP AS IS)
  if (user.must_set_password) {
    if (password !== user.temp_password) {
      throw new Error("Invalid temporary password");
    }

    return {
      requiresPasswordChange: true,
      email: user.email,
    };
  }

  // NORMAL LOGIN
  const isMatch = await bcrypt.compare(
    password,
    user.password_hash // ✅ FIXED (was password)
  );

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // ✅ SINGLE TOKEN (CLEAN)
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      projectIds: user.project_ids || null, // 👈 YOUR REQUIREMENT
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      projectId: user.project_id || null,
    },
  };
};