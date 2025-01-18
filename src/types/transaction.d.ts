type Transaction = {
  id: number,
  title: string,
  amount: number,
  date: Date,
  categoryBudget?: CategoryBudget,
  user?: User,
};
