import { getByProject as getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (projectId: string, month?: string) => {
  const allTasks = await getTasksByProject(projectId);

  const materialsRes = await pool.query(
    "SELECT * FROM materials WHERE project_id = $1",
    [projectId]
  );

  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE project_id = $1",
    [projectId]
  );

  const materials = materialsRes.rows;
  const subcontractors = subRes.rows;

  // ================= FILTER BY MONTH =================
  const tasks = month
    ? allTasks.filter((t: any) =>
        t.created_at?.toString().startsWith(month)
      )
    : allTasks;

  // ================= COSTS =================
  const totalMaterialCost = materials.reduce(
    (sum: number, m: any) => sum + Number(m.total_cost || 0),
    0
  );

  const totalSubCost = subcontractors.reduce(
    (sum: number, s: any) => sum + Number(s.total_contract_cost || 0),
    0
  );

  const totalTaskCost = tasks.reduce(
    (sum: number, t: any) => sum + Number(t.total_cost || 0),
    0
  );

  // ================= STATUS =================
  let completed = 0;
  let pending = 0;
  let inProgress = 0;

  tasks.forEach((task: any) => {
    if (task.status === "completed") completed++;
    else if (task.status === "in_progress") inProgress++;
    else pending++;
  });

  const totalTasks = tasks.length;

  const completionRate =
    totalTasks === 0 ? 0 : (completed / totalTasks) * 100;

  // ================= TASK ENRICHMENT =================
  const formattedTasks = tasks.map((task: any) => {
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;

    let daysTaken = 0;

    if (startDate && endDate) {
      daysTaken = Math.max(
        1,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
    }

    return {
      ...task,

      // 🔥 FORCE SAFE FIELDS
      start_date: task.start_date || null,
      end_date: task.end_date || null,

      daysTaken,
    };
  });

  return {
    projectId,

    summary: {
      totalTasks,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completionRate: Number(completionRate.toFixed(2)),

      materialCost: totalMaterialCost,
      subcontractorCost: totalSubCost,
      taskCost: totalTaskCost,

      totalProjectCost:
        totalMaterialCost + totalSubCost + totalTaskCost,
    },

    tasks: formattedTasks,
    materials,
    subcontractors,
  };
};