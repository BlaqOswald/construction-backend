import { pool } from "../db";

export const createProject = async (data: {
  name: string;
  budget: number;
  user_id: string;
}) => {
  const result = await pool.query(
    `INSERT INTO project (name, budget, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.name, data.budget, data.user_id]
  );

  return result.rows[0];
};

export const getProjects = async (user_id: string) => {
  const result = await pool.query(
    `SELECT * FROM project WHERE user_id = $1`,
    [user_id]
  );

  return result.rows;
};
