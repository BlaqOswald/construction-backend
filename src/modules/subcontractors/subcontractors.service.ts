import { pool } from "../../db";

/**
 * CREATE subcontractor (unchanged base logic)
 */
export const addSubcontractor = async (data: any) => {
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
      paid > 0
    ]
  );

  return result.rows[0];
};

/**
 * GET subcontractors + PAYMENT TIMELINE
 */
export const getByProject = async (projectId: string) => {
  const subs = await pool.query(
    `SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  const enriched = await Promise.all(
    subs.rows.map(async (sub) => {
      const payments = await pool.query(
        `SELECT * FROM subcontractor_payments
         WHERE subcontractor_id = $1
         ORDER BY payment_date DESC`,
        [sub.id]
      );

      return {
        ...sub,
        payments: payments.rows
      };
    })
  );

  return enriched;
};

/**
 * ADD PAYMENT (CORE FEATURE)
 */
export const addPayment = async (
  subcontractor_id: string,
  amount_paid: number,
  payment_date: string,
  note?: string
) => {
  // 1. insert payment record
  await pool.query(
    `INSERT INTO subcontractor_payments
     (subcontractor_id, amount_paid, payment_date, note)
     VALUES ($1,$2,$3,$4)`,
    [subcontractor_id, amount_paid, payment_date, note || null]
  );

  // 2. recalc total paid
  const paidRes = await pool.query(
    `SELECT COALESCE(SUM(amount_paid),0) AS total_paid
     FROM subcontractor_payments
     WHERE subcontractor_id = $1`,
    [subcontractor_id]
  );

  const totalPaid = Number(paidRes.rows[0].total_paid);

  // 3. get contract total
  const subRes = await pool.query(
    `SELECT total_contract_cost FROM subcontractors WHERE id = $1`,
    [subcontractor_id]
  );

  const totalCost = Number(subRes.rows[0].total_contract_cost);

  const balance = totalCost - totalPaid;

  // 4. update subcontractor summary
  await pool.query(
    `UPDATE subcontractors
     SET amount_paid = $1,
         balance = $2,
         paid = $3
     WHERE id = $4`,
    [totalPaid, balance, balance <= 0, subcontractor_id]
  );

  return { totalPaid, balance };
};

/**
 * DELETE
 */
export const deleteSubcontractor = async (id: string) => {
  await pool.query(`DELETE FROM subcontractors WHERE id = $1`, [id]);
};