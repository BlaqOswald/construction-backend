import { pool } from "../../db";

export const addSubcontractor = async (data: any) => {
  const result = await pool.query(
    `INSERT INTO subcontractors 
    (task_id, name, role, contract_cost, paid)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      data.task_id,
      data.name,
      data.role,
      data.contract_cost,
      data.paid ?? false,
    ]
  );

  return result.rows[0];
};

// ✅ THIS MUST EXIST EXACTLY LIKE THIS
export const getByTask = async (taskId: string) => {
  const result = await pool.query(
    "SELECT * FROM subcontractors WHERE task_id = $1",
    [taskId]
  );

  return result.rows;
};
