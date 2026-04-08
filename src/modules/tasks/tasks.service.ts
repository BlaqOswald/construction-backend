import { pool } from "../../db";

export const createTask = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO tasks 
    (project_id, date, activity, workers_count, work_description, total_cost)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.project_id,
      data.date,
      data.activity,
      data.workers_count,
      data.work_description,
      data.total_cost || 0,
    ]
  );

  return result.rows[0];
};

export const getTasksByProject = async (projectId: string) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE project_id = $1 ORDER BY date DESC",
    [projectId]
  );

  return result.rows;
};
