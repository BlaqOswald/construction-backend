import { pool } from "../../db";

export const addMaterial = async (data: any) => {
  const total_cost =
    Number(data.unit_cost) * Number(data.quantity_used);

  const result = await pool.query(
    `INSERT INTO materials
    (task_id, name, description, unit_cost, quantity_used, total_cost, currency, date_received)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.task_id,
      data.name,
      data.unit_cost,
      data.quantity_used,
      total_cost,
      data.currency || "UGX",
      data.date_received,
      data.description,

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
    `SELECT m.*
     FROM materials m
     JOIN tasks t ON t.id = m.task_id
     WHERE t.project_id = $1`,
    [projectId]
  );

  return result.rows;
};