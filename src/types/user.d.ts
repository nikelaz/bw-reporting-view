type User = {
  id: number,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  currency: string,
  categories?: Array<Category>,
  budgets?: Array<Budget>,
  transactions?: Array<Transaction>,
};
