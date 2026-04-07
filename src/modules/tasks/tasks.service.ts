let tasks: any[] = [];

export const createTask = (data: any) => {
  const task = {
    id: Date.now().toString(),
    project_id: data.project_id,
    date: data.date,
    activity: data.activity,
    workers: data.workers,
    work_description: data.work_description,
    subcontractor_cost: data.subcontractor_cost || 0,
    materials_cost: 0,
    total_cost: 0,
  };

  tasks.push(task);
  return task;
};

export const getTasksByProject = (projectId: string) => {
  return tasks.filter((t) => t.project_id === projectId);
};

export const updateTaskCost = (taskId: string, materialsCost: number) => {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  task.materials_cost = materialsCost;

  task.total_cost =
    task.workers * 100 + // default labour rate
    materialsCost +
    task.subcontractor_cost;

  return task;
};