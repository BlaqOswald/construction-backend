import { getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string) => {

  // GET TASKS
  const tasks = await getTasksByProject(projectId);

  // GET PROJECT MATERIALS (NEW ✅)
  const materialsRes = await pool.query(
    "SELECT * FROM materials WHERE project_id = $1",
    [projectId]
  );

  const materials = materialsRes.rows;

  // GET PROJECT SUBCONTRACTORS (NEW ✅)
  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE project_id = $1",
    [projectId]
  );

  const subcontractors = subRes.rows;

  // TOTALS
  const totalMaterialCost = materials.reduce(
    (sum, m) => sum + Number(m.total_cost || 0),
    0
  );

  const totalSubCost = subcontractors.reduce(
    (sum, s) => sum + Number(s.total_contract_cost || 0),
    0
  );

  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  // TASK STATUS COUNT
  tasks.forEach((task) => {
    if (task.status === "completed") completed++;
    else if (task.status === "in_progress") inProgress++;
    else pending++;
  });

  const totalTasks = tasks.length;

  const completionRate =
    totalTasks === 0 ? 0 : (completed / totalTasks) * 100;

  // 👉 SINCE MATERIALS + SUBS ARE PROJECT LEVEL
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

    insights: {
      mostExpensiveTask: null, // no longer task-based
      highestMaterialTask: null,
    },

    tasks: tasks.map((t) => ({
      ...t,
      materialCost: 0,
      subCost: 0,
      taskCost: 0,
    })),
  };
};