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
exports.getTaskLogs = exports.deleteTaskLog = exports.updateTaskLog = exports.addTaskLog = exports.deleteTask = exports.updateTask = exports.getByProject = exports.createTask = void 0;
const db_1 = require("../../db");
/* =========================
   CREATE TASK
========================= */
const createTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`INSERT INTO tasks (
      project_id, activity, description, workers_count, unit_cost,
      quantity, total_cost, status, start_date, end_date,
      task_type, category, subcontractor_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *`, [
        data.project_id,
        data.activity,
        data.description || null,
        data.workers_count || 0,
        data.unit_cost || 0,
        data.quantity || 0,
        data.total_cost || 0,
        data.status || "pending",
        data.start_date || null,
        data.end_date || null,
        data.task_type || "In-house",
        data.category || null,
        data.subcontractor_id || null,
    ]);
    return result.rows[0];
});
exports.createTask = createTask;
/* =========================
   GET BY PROJECT
========================= */
const getByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`
    SELECT
      t.*,

      MIN(l.entry_date) AS start_date,
      MAX(l.entry_date) AS end_date,

      CASE
        WHEN t.task_type = 'Subcontractor'
        THEN COALESCE(s.total_contract_cost, 0)
        ELSE COALESCE(SUM(l.total_cost), 0)
      END AS total_cost

    FROM tasks t

    LEFT JOIN task_logs l
      ON l.task_id = t.id

    LEFT JOIN subcontractors s
      ON s.id = t.subcontractor_id

    WHERE t.project_id = $1

    GROUP BY t.id, s.total_contract_cost

    ORDER BY t.created_at DESC
    `, [projectId]);
    return result.rows;
});
exports.getByProject = getByProject;
/* =========================
   UPDATE TASK
========================= */
const updateTask = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`UPDATE tasks SET
      activity = $1, description = $2, workers_count = $3,
      unit_cost = $4, quantity = $5, total_cost = $6, status = $7,
      start_date = $8, end_date = $9, task_type = $10,
      category = $11, subcontractor_id = $12
     WHERE id = $13
     RETURNING *`, [
        data.activity,
        data.description || null,
        data.workers_count || 0,
        data.unit_cost || 0,
        data.quantity || 0,
        data.total_cost || 0,
        data.status || "pending",
        data.start_date || null,
        data.end_date || null,
        data.task_type || "In-house",
        data.category || null,
        data.subcontractor_id || null,
        id,
    ]);
    return result.rows[0];
});
exports.updateTask = updateTask;
/* =========================
   DELETE TASK
========================= */
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
});
exports.deleteTask = deleteTask;
/* =========================
   ADD TASK LOG
========================= */
const addTaskLog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const total_cost = Number((_a = data.total_cost) !== null && _a !== void 0 ? _a : (Number(data.workers_count || 0) * Number(data.unit_cost || 0)));
    const result = yield db_1.pool.query(`INSERT INTO task_logs (
      task_id, entry_date, quantity_done, workers_count,
      unit_cost, total_cost, remarks
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`, [
        data.task_id,
        data.entry_date,
        data.quantity_done || 1,
        data.workers_count || 1,
        data.unit_cost || 0,
        total_cost,
        data.remarks || null,
    ]);
    return result.rows[0];
});
exports.addTaskLog = addTaskLog;
/* =========================
   UPDATE TASK LOG
========================= */
const updateTaskLog = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const total_cost = Number((_a = data.total_cost) !== null && _a !== void 0 ? _a : Number(data.workers_count) * Number(data.unit_cost));
    const result = yield db_1.pool.query(`UPDATE task_logs SET
      entry_date = $1, quantity_done = $2, workers_count = $3,
      unit_cost = $4, total_cost = $5, remarks = $6
     WHERE id = $7
     RETURNING *`, [
        data.entry_date,
        data.quantity_done || 1,
        data.workers_count || 1,
        data.unit_cost || 0,
        total_cost,
        data.remarks || null,
        id,
    ]);
    return result.rows[0];
});
exports.updateTaskLog = updateTaskLog;
/* =========================
   DELETE TASK LOG
========================= */
const deleteTaskLog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.pool.query(`DELETE FROM task_logs WHERE id = $1`, [id]);
});
exports.deleteTaskLog = deleteTaskLog;
/* =========================
   GET LOGS BY PROJECT
========================= */
const getTaskLogs = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT
      tl.*,
      t.activity AS task_name,
      t.category,
      t.task_type
    FROM task_logs tl
    JOIN tasks t ON t.id = tl.task_id
    WHERE t.project_id = $1
    ORDER BY tl.entry_date DESC`, [projectId]);
    return result.rows;
});
exports.getTaskLogs = getTaskLogs;
