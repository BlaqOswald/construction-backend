import { pool } from "../../db";

export const addSubcontractor = async (data: any) => {
  console.log("🔥 RAW DATA:", data);

  const total = Number(data.total_contract_cost || 0);
  const paid = Number(data.amount_paid || 0);
  const balance = total - paid;

  const result = await pool.query(
    `INSERT INTO subcontractors
    (project_id, name, task_work, description, payment_date, total_contract_cost, amount_paid, balance, paid)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      data.project_id,
      data.name,
      data.task_work,
      data.description || null,
      data.payment_date || null,
      total,
      paid,
      balance,
      false,
    ]
  );

  return result.rows[0];
};

export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
};