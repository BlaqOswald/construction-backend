import { pool } from "../../db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

/**
 * CREATE USER (ADMIN ONLY)
 * Stored in PostgreSQL
 */
export const createUser = async (data: any) => {
  const id = uuidv4();

  const tempPassword = data.tempPassword || "123456";

  await pool.query(
    `
    INSERT INTO users (
      id,
      name,
      email,
      role,
      password,
      temp_password,
      must_set_password
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      id,
      data.name,
      data.email,
      data.role,
      null, // password not set yet
      tempPassword,
      true,
    ]
  );

  return {
    id,
    name: data.name,
    email: data.email,
    role: data.role,
    tempPassword,
    mustSetPassword: true,
  };
};

/**
 * GET ALL USERS (ADMIN ONLY)
 */
export const getUsers = async () => {
  const result = await pool.query(
    "SELECT * FROM users ORDER BY created_at DESC"
  );

  return result.rows;
};

/**
 * SET PASSWORD (FIRST LOGIN FLOW)
 */
export const setPassword = async (
  email: string,
  password: string
) => {
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    UPDATE users
    SET password = $1,
        temp_password = NULL,
        must_set_password = false
    WHERE email = $2
    RETURNING id, email
    `,
    [hashed, email]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found");
  }

  return {
    message: "Password set successfully",
  };
};