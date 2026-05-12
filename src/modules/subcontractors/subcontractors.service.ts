import { pool } from "../../db";

export const addSubcontractor = async (data: any) => {
  const total = Number(data.total_contract_cost || 0);
  const paid = Number(data.amount_paid || 0);
  const balance = total - paid;

  const result = await pool.query(
    `INSERT INTO subcontractors
    (project_id, name, task_work, description, payment_date,
     total_contract_cost, amount_paid, balance, paid, payment_history)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
      JSON.stringify([]),
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

// ✅ PAYMENT LOGIC (NEW — APPENDS HISTORY)
export const addPayment = async (id: string, payment: any) => {
  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE id = $1",
    [id]
  );

  const sub = subRes.rows[0];

  const history = sub.payment_history || [];

  const newPayment = {
    amount_paid: Number(payment.amount_paid),
    payment_date: payment.payment_date,
    note: payment.note || "",
  };

  const updatedHistory = [...history, newPayment];

  const totalPaid = updatedHistory.reduce(
    (sum: number, p: any) => sum + Number(p.amount_paid || 0),
    0
  );

  const balance =
    Number(sub.total_contract_cost || 0) - totalPaid;

  const result = await pool.query(
    `UPDATE subcontractors
     SET amount_paid = $1,
         balance = $2,
         payment_history = $3
     WHERE id = $4
     RETURNING *`,
    [totalPaid, balance, JSON.stringify(updatedHistory), id]
  );

  return result.rows[0];
};

export const deleteSubcontractor = async (id: string) => {
  await pool.query(`DELETE FROM subcontractors WHERE id = $1`, [id]);
};