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

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  /**
   * STEP 1: FIRST LOGIN (TEMP PASSWORD FLOW)
   */
  if (user.must_set_password) {
    const isTempValid = password === user.temp_password;

    if (!isTempValid) {
      throw new Error("Invalid temporary password");
    }

    return {
      requiresPasswordChange: true,
      email: user.email,
    };
  }

  /**
   * STEP 2: NORMAL LOGIN
   */
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      projectIds: user.project_ids || [],
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return {
    token,
    user,
  };
};