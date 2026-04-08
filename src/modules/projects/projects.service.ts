import { pool } from "../../db";

export const createProject = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO projects (name, type, location, supervisor_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.type, data.location, data.supervisor_id]
  );

  return result.rows[0];
};

export const getProjects = async () => {
  const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
  return result.rows;
};

export const getProject = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const lockProject = async (id: string) => {
  const result = await pool.query(
    "UPDATE projects SET locked = true WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};
