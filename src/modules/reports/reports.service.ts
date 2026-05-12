import { getByProject as getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

export const getReport = async (
  projectId: string,
  month?: string
) => {
  // TASKS
  const allTasks = await getTasksByProject(projectId);

  // MATERIALS
  const materialsRes = await pool.query(
    "SELECT * FROM materials WHERE project_id = $1",
    [projectId]
  );

  // SUBCONTRACTORS
  const subRes = await pool.query(
    "SELECT * FROM subcontractors WHERE project_id = $1",
    [projectId]
  );

  // MONTH FILTER
  const tasks = month
    ? allTasks.filter((t: any) =>
        t.start_date?.toString().startsWith(month)
      )
    : allTasks;

  const materials = month
    ? materialsRes.rows.filter((m: any) =>
        m.created_at?.toString().startsWith(month)
      )
    : materialsRes.rows;

  const subcontractors = month
    ? subRes.rows.filter((s: any) =>
        s.created_at?.toString().startsWith(month)
      )
    : subRes.rows;

  // COSTS
  const totalMaterialCost = materials.reduce(
    (sum: number, m: any) => sum + Number(m.total_cost || 0),
    0
  );

  const totalSubCost = subcontractors.reduce(
    (sum: number, s: any) =>
      sum + Number(s.total_contract_cost || 0),
    0
  );

  const totalTaskCost = tasks.reduce(
    (sum: number, t: any) =>
      sum + Number(t.total_cost || 0),
    0
  );

  // STATUS COUNTS
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
    totalTasks === 0
      ? 0
      : (completed / totalTasks) * 100;

  // TASK DAYS
  const formattedTasks = tasks.map((task: any) => {
    let daysTaken = 0;

    if (task.start_date && task.end_date) {
      const start = new Date(task.start_date);
      const end = new Date(task.end_date);

      daysTaken = Math.ceil(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }

    return {
      ...task,
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
      completionRate: Number(
        completionRate.toFixed(2)
      ),

      materialCost: totalMaterialCost,
      subcontractorCost: totalSubCost,
      taskCost: totalTaskCost,
      totalProjectCost:
        totalMaterialCost +
        totalSubCost +
        totalTaskCost,
    },

    tasks: formattedTasks,
    materials,
    subcontractors,
  };
};