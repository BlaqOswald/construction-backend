import { getTasksByProject } from "../tasks/tasks.service";

export const getReport = (projectId: string) => {
  const tasks = getTasksByProject(projectId);

  const totalCost = tasks.reduce((sum, t) => sum + t.total_cost, 0);

  return {
    total_tasks: tasks.length,
    total_cost: totalCost,
    tasks,
  };
};
