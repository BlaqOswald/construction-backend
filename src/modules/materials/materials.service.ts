import { pool } from "../../db";

export const addMaterial = async (data: any) => {
  // 💰 AUTO COST CALCULATION (IMPORTANT PART)
  const totalCost =
    Number(data.unit_cost || 0) * Number(data.quantity_used || 0);

  const result = await pool.query(
    `INSERT INTO materials 
    (task_id, name, unit_cost, quantity_used, total_cost)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.task_id,
      data.name,
      data.unit_cost,
      data.quantity_used,
      totalCost,
    ]
  );

  return result.rows[0];
};

export const getMaterialsByTask = async (taskId: string) => {
  const result = await pool.query(
    "SELECT * FROM materials WHERE task_id = $1",
    [taskId]
  );

  return result.rows;
};
