import { pool } from "../../db";

export const addMaterial = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO materials
    (project_id, name, unit_cost, quantity_used, total_cost, currency, description, date_received)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      data.project_id,
      data.name,
      data.unit_cost,
      data.quantity_used,
      data.total_cost,
      data.currency,
      data.description || "",
      data.date_received || null,
    ]
  );

  return result.rows[0];
};
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM materials 
     WHERE project_id = $1 
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};
