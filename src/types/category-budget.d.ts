type CategoryBudget = {
  id: number,
  amount: number,
  currentAmount: number,
  category?: Category,
  budget?: Budget,
  transactions?: Array<Transaction>,
};
