"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = exports.updateSubcontractor = exports.deleteSubcontractor = exports.getByProject = exports.addSubcontractor = void 0;
const db_1 = require("../../db");
// ===================== NORMALIZER =====================
const normalize = (row) => {
    return Object.assign(Object.assign({}, row), { payment_history: parseHistory(row.payment_history) });
};
const parseHistory = (data) => {
    if (!data)
        return [];
    if (typeof data === "string") {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return [];
        }
    }
    return Array.isArray(data) ? data : [];
};
// ===================== CREATE =====================
const addSubcontractor = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const pricingType = data.pricing_type || "Fixed";
    let total = Number(data.total_contract_cost || 0);
    // VARIABLE CALCULATION
    if (pricingType === "Variable") {
        total =
            Number(data.quantity || 0) *
                Number(data.unit_cost || 0);
    }
    const paid = Number(data.amount_paid || 0);
    const balance = total - paid;
    const result = yield db_1.pool.query(`INSERT INTO subcontractors
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
      unit_type,
      quantity,
      unit_cost
     )
     VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,$9,$10,
      $11,$12,$13,$14
     )
     RETURNING *`, [
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
                        payment_date: data.payment_date ||
                            new Date().toISOString().split("T")[0],
                        note: "Initial payment",
                    },
                ]
                : []),
        ]),
        pricingType,
        data.unit_type || null,
        Number(data.quantity || 0),
        Number(data.unit_cost || 0),
    ]);
    return normalize(result.rows[0]);
});
exports.addSubcontractor = addSubcontractor;
// ===================== GET =====================
const getByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * FROM subcontractors
     WHERE project_id = $1
     ORDER BY created_at DESC`, [projectId]);
    return result.rows.map(normalize);
});
exports.getByProject = getByProject;
// ===================== DELETE =====================
const deleteSubcontractor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query(`DELETE FROM subcontractors WHERE id = $1`, [id]);
});
exports.deleteSubcontractor = deleteSubcontractor;
// ===================== UPDATE =====================
const updateSubcontractor = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    // ================= GET EXISTING =================
    const existingRes = yield db_1.pool.query(`SELECT * FROM subcontractors WHERE id = $1`, [id]);
    if (existingRes.rows.length === 0) {
        throw new Error("Subcontractor not found");
    }
    const existing = existingRes.rows[0];
    // ================= SAFE VALUES =================
    const pricingType = data.pricing_type || existing.pricing_type || "Fixed";
    const quantity = Number((_b = (_a = data.quantity) !== null && _a !== void 0 ? _a : existing.quantity) !== null && _b !== void 0 ? _b : 0);
    const unitCost = Number((_d = (_c = data.unit_cost) !== null && _c !== void 0 ? _c : existing.unit_cost) !== null && _d !== void 0 ? _d : 0);
    // ================= TOTAL =================
    let total = Number((_f = (_e = data.total_contract_cost) !== null && _e !== void 0 ? _e : existing.total_contract_cost) !== null && _f !== void 0 ? _f : 0);
    // VARIABLE AUTO CALCULATION
    if (pricingType === "Variable") {
        total = quantity * unitCost;
    }
    // ================= KEEP PAYMENT HISTORY =================
    const history = parseHistory(existing.payment_history);
    // PAYMENT HISTORY IS SOURCE OF TRUTH
    const totalPaid = history.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0);
    const balance = total - totalPaid;
    const fullyPaid = balance <= 0;
    // ================= UPDATE =================
    const result = yield db_1.pool.query(`
    UPDATE subcontractors
    SET
      name = $1,
      task_work = $2,
      description = $3,
      payment_date = $4,

      total_contract_cost = $5,
      amount_paid = $6,
      balance = $7,
      paid = $8,

      pricing_type = $9,
      unit_type = $10,
      quantity = $11,
      unit_cost = $12

    WHERE id = $13

    RETURNING *
    `, [
        data.name || existing.name,
        data.task_work || existing.task_work,
        data.description || existing.description,
        data.payment_date || existing.payment_date,
        total,
        totalPaid,
        balance,
        fullyPaid,
        pricingType,
        data.unit_type || existing.unit_type,
        quantity,
        unitCost,
        id,
    ]);
    return normalize(result.rows[0]);
});
exports.updateSubcontractor = updateSubcontractor;
// ===================== PAYMENT UPDATE =====================
const addPayment = (id, payment) => __awaiter(void 0, void 0, void 0, function* () {
    const subRes = yield db_1.pool.query(`SELECT * FROM subcontractors WHERE id = $1`, [id]);
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
    const totalPaid = newHistory.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0);
    const balance = Number(sub.total_contract_cost || 0) - totalPaid;
    const fullyPaid = balance <= 0;
    const result = yield db_1.pool.query(`UPDATE subcontractors
     SET
      amount_paid = $1,
      balance = $2,
      paid = $3,
      last_payment_date = $4,
      payment_note = $5,
      payment_history = $6
     WHERE id = $7
     RETURNING *`, [
        totalPaid,
        balance,
        fullyPaid,
        payment.payment_date || null,
        payment.note || null,
        JSON.stringify(newHistory),
        id,
    ]);
    return normalize(result.rows[0]);
});
exports.addPayment = addPayment;
