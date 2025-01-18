type Budget = {
  id: number,
  month: Date | string,
  categoryBudgets?: Array<CategoryBudget>,
  user?: User
};
