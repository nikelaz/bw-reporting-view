type Category = {
  id: number,
  type: CategoryType,
  title: string,
  accAmount: number,
  user?: User,
  categoryBudgets?: Array<CategoryBudget>
};
