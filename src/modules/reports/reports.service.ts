import { getByProject as getTasksByProject } from "../tasks/tasks.service";
import { pool } from "../../db";

const getDays = (start?: string, end?: string) => {
  if (!start || !end) return 1;

  const s = new Date(start);
  const e = new Date(end);

  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;

  const diff = e.getTime() - s.getTime();

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

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

  const tasks = month
    ? allTasks.filter(t =>
        t.start_date?.startsWith(month)
      )
    : allTasks;

  const materials = month
    ? materialsRes.rows.filter(m =>
        m.created_at?.startsWith(month)
      )
    : materialsRes.rows;

  const subcontractors = month
    ? subRes.rows.filter(s =>
        s.created_at?.startsWith(month)
      )
    : subRes.rows;

  let completed = 0;
  let pending = 0;
  let inProgress = 0;

  const formattedTasks = tasks.map(t => {
    const days = getDays(t.start_date, t.end_date);

    if (t.status === "completed") completed++;
    else if (t.status === "in_progress") inProgress++;
    else pending++;

    return {
      ...t,
      durationDays: days,
    };
  });

  const materialCost = materials.reduce((a, b) => a + Number(b.total_cost || 0), 0);
  const subCost = subcontractors.reduce((a, b) => a + Number(b.total_contract_cost || 0), 0);
  const taskCost = tasks.reduce((a, b) => a + Number(b.total_cost || 0), 0);

  const total = tasks.length;

  return {
    projectId,

    summary: {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completionRate: total ? (completed / total) * 100 : 0,

      materialCost,
      subcontractorCost: subCost,
      taskCost,
      totalProjectCost: materialCost + subCost + taskCost,
    },

    tasks: formattedTasks,
    materials,
    subcontractors,
  };
};