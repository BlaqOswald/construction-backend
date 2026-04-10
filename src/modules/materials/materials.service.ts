import { pool } from "../../db";

export const addMaterial = async (data: any) => {
  // 💰 AUTO COST CALCULATION
  const total_cost = data.unit_cost * data.quantity_used;

  const result = await pool.query(
    `INSERT INTO materials 
    (task_id, name, description, unit_cost, quantity_used, total_cost, currency, date_received, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
    RETURNING *`,
    [
      data.task_id || null,
      data.name,
      data.description || null,
      data.unit_cost,
      data.quantity_used,
      total_cost,
      data.currency || "UGX",
      data.date_received || null,
    ]
  );

  return result.rows[0];
};

export const getMaterialsByTask = async (taskId: string) => {
  const result = await pool.query(
    "SELECT * FROM materials WHERE task_id = $1",
    [taskId]
  );

  return result.rows;
};
export const getMaterialsByProject = async (projectId: string) => {
  const result = await pool.query(
    `
    SELECT m.*
    FROM materials m
    JOIN tasks t ON m.task_id = t.id
    WHERE t.project_id = $1
    ORDER BY m.created_at DESC
    `,
    [projectId]
  );

  return result.rows;
};
