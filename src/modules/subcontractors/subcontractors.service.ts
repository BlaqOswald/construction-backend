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
  const pricingType = data.pricing_type || "Fixed";

  let total = Number(data.total_contract_cost || 0);

  // ================= VARIABLE CALCULATION =================
  if (pricingType === "Variable") {
    total =
      Number(data.quantity || 0) *
      Number(data.unit_cost || 0);
  }

  const paid = Number(data.amount_paid || 0);

  const balance = total - paid;

  const result = await pool.query(
    `INSERT INTO subcontractors
     (
      project_id,
      name,
      task_work,
      description,
      payment_date,
      total_contract_cost,
      amount_paid,
      balance,
      paid,
      payment_history,

      pricing_type,
      measurement_type,
      quantity,
      unit_cost

     )
     VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,$9,$10,
      $11,$12,$13,$14
     )
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
        ...(paid > 0
          ? [
              {
                amount_paid: paid,
                payment_date:
                  data.payment_date ||
                  new Date()
                    .toISOString()
                    .split("T")[0],
                note: "Initial payment",
              },
            ]
          : []),
      ]),

      pricingType,
      data.measurement_type || null,
      Number(data.quantity || 0),
      Number(data.unit_cost || 0),
    ]
  );

  return normalize(result.rows[0]);
};

// ===================== GET =====================
export const getByProject = async (
  projectId: string
) => {
  const result = await pool.query(
    `SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows.map(normalize);
};

// ===================== DELETE =====================
export const deleteSubcontractor = async (
  id: string
) => {
  await pool.query(
    `DELETE FROM subcontractors WHERE id = $1`,
    [id]
  );
};

// ===================== UPDATE =====================
export const updateSubcontractor = async (
  id: string,
  data: any
) => {
  const pricingType = data.pricing_type || "Fixed";

  let total = Number(data.total_contract_cost || 0);

  // ================= VARIABLE CALCULATION =================
  if (pricingType === "Variable") {
    total =
      Number(data.quantity || 0) *
      Number(data.unit_cost || 0);
  }

  // ================= GET EXISTING RECORD =================
  const existingRes = await pool.query(
    `SELECT * FROM subcontractors WHERE id = $1`,
    [id]
  );

  const existing = existingRes.rows[0];

  const history = parseHistory(
    existing.payment_history
  );

  // ================= RECALCULATE PAID =================
  const historyPaid = history.reduce(
    (sum: number, p: any) =>
      sum + Number(p.amount_paid || 0),
    0
  );

  const manualPaid = Number(
    data.amount_paid || 0
  );

  const totalPaid =
    historyPaid > manualPaid
      ? historyPaid
      : manualPaid;

  const balance = total - totalPaid;

  const result = await pool.query(
    `UPDATE subcontractors
     SET
      name = $1,
      task_work = $2,
      description = $3,
      payment_date = $4,

      total_contract_cost = $5,
      amount_paid = $6,
      balance = $7,

      pricing_type = $8,
      measurement_type = $9,
      quantity = $10,
      unit_cost = $11

     WHERE id = $12
     RETURNING *`,
    [
      data.name,
      data.task_work,
      data.description,
      data.payment_date || null,

      total,
      totalPaid,
      balance,

      pricingType,
      data.measurement_type || null,
      Number(data.quantity || 0),
      Number(data.unit_cost || 0),

      id,
    ]
  );

  return normalize(result.rows[0]);
};

// ===================== PAYMENT UPDATE =====================
export const addPayment = async (
  id: string,
  payment: any
) => {
  const subRes = await pool.query(
    `SELECT * FROM subcontractors WHERE id = $1`,
    [id]
  );

  const sub = subRes.rows[0];

  const history = parseHistory(
    sub.payment_history
  );

  const newHistory = [
    ...history,
    {
      amount_paid: Number(payment.amount_paid),
      payment_date: payment.payment_date,
      note: payment.note || "",
    },
  ];

  const totalPaid = newHistory.reduce(
    (sum, p) =>
      sum + Number(p.amount_paid || 0),
    0
  );

  const balance =
    Number(sub.total_contract_cost || 0) -
    totalPaid;

  const fullyPaid = balance <= 0;

  const result = await pool.query(
    `UPDATE subcontractors
     SET
      amount_paid = $1,
      balance = $2,
      paid = $3,
      last_payment_date = $4,
      payment_note = $5,
      payment_history = $6
     WHERE id = $7
     RETURNING *`,
    [
      totalPaid,
      balance,
      fullyPaid,
      payment.payment_date || null,
      payment.note || null,
      JSON.stringify(newHistory),
      id,
    ]
  );

  return normalize(result.rows[0]);
};