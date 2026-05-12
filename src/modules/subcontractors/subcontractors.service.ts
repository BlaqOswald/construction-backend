import { pool } from "../../db";

// ===================== NORMALIZER =====================
const normalize = (row: any) => {
  return {
    ...row,
    payment_history: parseHistory(row.payment_history),
  };
};

const parseHistory = (data: any) => {
  if (!data) return [];

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  return Array.isArray(data) ? data : [];
};

// ===================== CREATE =====================
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
      JSON.stringify([
        ...(data.amount_paid > 0
          ? [
              {
                amount_paid: paid,
                payment_date: data.payment_date || new Date().toISOString().split("T")[0],
                note: "Initial payment",
              },
            ]
          : []),
      ]),
    ]
  );

  return normalize(result.rows[0]);
};

// ===================== GET =====================
export const getByProject = async (projectId: string) => {
  const result = await pool.query(
    `SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows.map(normalize);
};

// ===================== DELETE =====================
export const deleteSubcontractor = async (id: string) => {
  await pool.query(`DELETE FROM subcontractors WHERE id = $1`, [id]);
};

// ===================== PAYMENT UPDATE =====================
export const addPayment = async (id: string, payment: any) => {
  const subRes = await pool.query(
    `SELECT * FROM subcontractors WHERE id = $1`,
    [id]
  );

  const sub = subRes.rows[0];

  const history = parseHistory(sub.payment_history);

  const newHistory = [
    ...history,
    {
      amount_paid: Number(payment.amount_paid),
      payment_date: payment.payment_date,
      note: payment.note || "",
    },
  ];

  const totalPaid = newHistory.reduce(
    (sum, p) => sum + Number(p.amount_paid),
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
    [totalPaid, balance, JSON.stringify(newHistory), id]
  );

  return normalize(result.rows[0]);
};