import { pool } from "../../db";

/**
 * CREATE / UPDATE subcontractor
 */
export const addSubcontractor = async (data: any) => {
  const total = Number(data.total_contract_cost || 0);
  const paid = Number(data.amount_paid || 0);
  const balance = total - paid;

  const result = await pool.query(
    `INSERT INTO subcontractors
    (project_id, name, task_work, description, payment_date, total_contract_cost, amount_paid, balance)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
    ]
  );

  return result.rows[0];
};

/**
 * GET ALL SUBCONTRACTORS (WITH CLEAN CALCULATED BALANCE)
 */
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  // ensure always consistent calculation
  return result.rows.map((s) => {
    const paid = Number(s.amount_paid || 0);
    const total = Number(s.total_contract_cost || 0);

    return {
      ...s,
      balance: total - paid,
    };
  });
};

/**
 * UPDATE PAYMENT (MAIN UPGRADE FEATURE)
 * - now acts like "payment flow"
 */
export const updatePayment = async (id: string, payment: any) => {
  const subRes = await pool.query(
    `SELECT * FROM subcontractors WHERE id = $1`,
    [id]
  );

  const sub = subRes.rows[0];

  const newPaid =
    Number(sub.amount_paid || 0) + Number(payment.amount_paid || 0);

  const newBalance = Number(sub.total_contract_cost) - newPaid;

  const result = await pool.query(
    `UPDATE subcontractors
     SET amount_paid = $1,
         balance = $2,
         last_payment_date = $3,
         payment_note = $4
     WHERE id = $5
     RETURNING *`,
    [
      newPaid,
      newBalance,
      payment.payment_date || new Date(),
      payment.note || null,
      id,
    ]
  );

  return result.rows[0];
};

/**
 * DELETE
 */
export const deleteSubcontractor = async (id: string) => {
  await pool.query(`DELETE FROM subcontractors WHERE id = $1`, [id]);
};