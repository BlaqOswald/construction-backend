let materials: any[] = [];

export const addMaterial = (data: any) => {
  const total =
    data.unit_cost != null
      ? data.unit_cost * data.quantity
      : data.total_cost;

  const material = {
    id: Date.now().toString(),
    task_id: data.task_id,
    name: data.name,
    unit_cost: data.unit_cost,
    quantity: data.quantity,
    total_cost: total,
  };

  materials.push(material);
  return material;
};

export const getMaterialsByTask = (taskId: string) => {
  return materials.filter((m) => m.task_id === taskId);
};

export const getTotalMaterialCost = (taskId: string) => {
  return materials
    .filter((m) => m.task_id === taskId)
    .reduce((sum, m) => sum + m.total_cost, 0);
};
