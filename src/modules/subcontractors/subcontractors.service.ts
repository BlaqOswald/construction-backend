import { pool } from "../../db";

export const addSubcontractor = async (data: any) => {
  const balance =
    Number(data.total_contract_cost || 0) -
    Number(data.amount_paid || 0);

  const result = await pool.query(
    `INSERT INTO subcontractors 
    (task_id, name, task_work, description, payment_date, total_contract_cost, amount_paid, balance, paid)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      data.task_id,
      data.name,
      data.task_work,
      data.description || null,
      data.payment_date || null,
      data.total_contract_cost,
      data.amount_paid || 0,
      balance,
      data.paid ?? false,
    ]
  );

  return result.rows[0];
};

export const getByTask = async (taskId: string) => {
  const result = await pool.query(
    "SELECT * FROM subcontractors WHERE task_id = $1 ORDER BY payment_date DESC",
    [taskId]
  ).catch(() => ({ rows: [] }));

  return result.rows;
};
