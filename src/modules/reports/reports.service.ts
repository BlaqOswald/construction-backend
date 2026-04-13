import { getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string) => {

  const tasks = await getTasksByProject(projectId);

  let totalMaterialCost = 0;
  let totalSubCost = 0;
  let totalTaskCost = 0;

  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  let mostExpensiveTask: any = null;
  let highestMaterialTask: any = null;

  const enrichedTasks = await Promise.all(
    tasks.map(async (task) => {
      // MATERIALS
      const materialsRes = await pool.query(
        "SELECT * FROM materials WHERE task_id = $1",
        [task.id]
      ).catch(() => ({ rows: [] }));

      const materials = materialsRes.rows;
      const materialCost = materials.reduce(
        (sum, m) => sum + Number(m.total_cost || 0),
        0
      );

      // SUBCONTRACTORS
      const subRes = await pool.query(
        "SELECT * FROM subcontractors WHERE task_id = $1",
        [task.id]
      );

      const subcontractors = subRes.rows;
      const subCost = subcontractors.reduce(
        (sum, s) =>
          sum +
          Number(s.total_contract_cost || s.contract_cost || 0),
        0
      );

      const taskCost =
        Number(task.total_cost || 0) + materialCost + subCost;

      // STATUS TRACKING
      if (task.status === "completed") completed++;
      else if (task.status === "in_progress") inProgress++;
      else pending++;

      totalMaterialCost += materialCost;
      totalSubCost += subCost;
      totalTaskCost += taskCost;

      // MOST EXPENSIVE TASK
      if (!mostExpensiveTask || taskCost > mostExpensiveTask.taskCost) {
        mostExpensiveTask = { ...task, taskCost };
      }

      // HIGHEST MATERIAL USAGE
      if (!highestMaterialTask || materialCost > highestMaterialTask.materialCost) {
        highestMaterialTask = { ...task, materialCost };
      }

      return {
        ...task,
        materials,
        subcontractors,
        materialCost,
        subCost,
        taskCost,
      };
    })
  );

  const totalTasks = tasks.length;

  const completionRate =
    totalTasks === 0 ? 0 : (completed / totalTasks) * 100;

  const totalProjectCost =
    totalMaterialCost + totalSubCost + totalTaskCost;

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
      taskCost: totalTaskCost,
      totalProjectCost,
    },

    insights: {
      mostExpensiveTask,
      highestMaterialTask,
    },

    tasks: enrichedTasks,
  };
};
