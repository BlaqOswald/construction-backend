import { pool } from "../../db";

export const addMaterial = async (data: any) => {
  const {
    project_id,
    name,
    unit_cost,
    quantity_used,
    total_cost,
    currency,
    description,
    date_received,
  } = data;

  const result = await pool.query(
    `INSERT INTO materials
    (project_id, name, unit_cost, quantity_used, total_cost, currency, description, date_received)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      project_id,
      name,
      unit_cost,
      quantity_used,
      total_cost,
      currency,
      description,
      date_received,
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
