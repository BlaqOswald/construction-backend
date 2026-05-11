import { getByProject as getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string) => {

  // ======================
  // TASKS
  // ======================
  const tasks = await getTasksByProject(projectId);

  // ======================
  // MATERIALS
  // ======================
  const materialsRes = await pool.query(
    "SELECT * FROM materials WHERE project_id = $1",
    [projectId]
  );

  const materials = materialsRes.rows;

  // ======================
  // SUBCONTRACTORS
  // ======================
  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE project_id = $1",
    [projectId]
  );

  const subcontractors = subRes.rows;

  // ======================
  // MATERIAL COST
  // ======================
  const totalMaterialCost = materials.reduce(
    (sum: number, m: any) => sum + Number(m.total_cost || 0),
    0
  );

  // ======================
  // SUBCONTRACTOR COST
  // ======================
  const totalSubCost = subcontractors.reduce(
    (sum: number, s: any) => sum + Number(s.total_contract_cost || 0),
    0
  );

  // ======================
  // TASK STATS
  // ======================
  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  tasks.forEach((task: any) => {
    if (task.status === "completed") completed++;
    else if (task.status === "in_progress") inProgress++;
    else pending++;
  });

  const totalTasks = tasks.length;

  const completionRate =
    totalTasks === 0 ? 0 : (completed / totalTasks) * 100;

  // ======================
  // TOTAL COST
  // ======================
  const totalProjectCost = totalMaterialCost + totalSubCost;

  return {
    projectId,

    summary: {
      totalTasks,
      completedTasks: completed,
      inProgressTasks: inProgress,
      pendingTasks: pending,
      completionRate: Number(completionRate.toFixed(2)),

      materialCost: totalMaterialCost,
      subcontractorCost: totalSubCost,
      totalProjectCost,
    },

    tasks: tasks.map((t: any) => ({
      ...t,
      materialCost: 0,
      subCost: 0,
      taskCost: 0,
    })),
  };
};