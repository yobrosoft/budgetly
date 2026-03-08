export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'utilities'
  | 'other';

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'utilities',
  'other',
];

export interface Expense {
  readonly id: string;
  readonly amount: number;
  readonly category: ExpenseCategory;
  readonly date: string;
  readonly note: string;
  readonly createdAt: string;
}

export interface ExpenseStore {
  readonly version: 1;
  readonly expenses: Expense[];
}

export interface AddExpenseInput {
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string;
}
