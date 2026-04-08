import { getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string) => {
  const tasks = await getTasksByProject(projectId);

  let totalTaskCost = 0;
  let totalMaterialCost = 0;
  let totalSubCost = 0;

  const enrichedTasks = await Promise.all(
    tasks.map(async (task) => {
      // 🔹 MATERIALS
      const materialsRes = await pool.query(
        "SELECT * FROM materials WHERE task_id = $1",
        [task.id]
      );

      const materials = materialsRes.rows;
      const materialCost = materials.reduce(
        (sum, m) => sum + Number(m.total_cost),
        0
      );

      // 🔹 SUBCONTRACTORS
      const subRes = await pool.query(
        "SELECT * FROM subcontractors WHERE task_id = $1",
        [task.id]
      );

      const subcontractors = subRes.rows;
      const subCost = subcontractors.reduce(
        (sum, s) => sum + Number(s.contract_cost),
        0
      );

      // 🔹 TASK TOTAL
      const taskCost =
        Number(task.total_cost) + materialCost + subCost;

      totalTaskCost += Number(task.total_cost);
      totalMaterialCost += materialCost;
      totalSubCost += subCost;

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

  return {
    projectId,
    summary: {
      taskCost: totalTaskCost,
      materialCost: totalMaterialCost,
      subcontractorCost: totalSubCost,
      totalProjectCost:
        totalTaskCost + totalMaterialCost + totalSubCost,
    },
    tasks: enrichedTasks,
  };
};
