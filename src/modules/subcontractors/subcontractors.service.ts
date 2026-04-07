let subcontractors: any[] = [];

export const addSubcontractor = (data: any) => {
  const total =
    data.rate_type === "hourly"
      ? data.rate * data.hours
      : data.rate;

  const sub = {
    id: Date.now().toString(),
    task_id: data.task_id,
    name: data.name,
    work_type: data.work_type,
    hours: data.hours,
    rate: data.rate,
    rate_type: data.rate_type,
    total_cost: total,
  };

  subcontractors.push(sub);
  return sub;
};

export const getByTask = (taskId: string) =>
  subcontractors.filter((s) => s.task_id === taskId);
