import type { Command } from 'commander';
import type { Expense, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../types';
import { getAllExpenses } from '../storage';
import { formatExpenseTable } from '../utils/format';

export function filterExpenses(
  expenses: Expense[],
  opts: { category?: string; from?: string; to?: string }
): Expense[] {
  let result = expenses;

  if (opts.category !== undefined) {
    result = result.filter((e) => e.category === opts.category);
  }
  if (opts.from !== undefined) {
    const from = opts.from;
    result = result.filter((e) => e.date >= from);
  }
  if (opts.to !== undefined) {
    const to = opts.to;
    result = result.filter((e) => e.date <= to);
  }

  return result.slice().sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function registerListCommand(program: Command): void {
  program
    .command('list')
    .description('List expenses')
    .option('-c, --category <category>', 'Filter by category')
    .option('--from <date>', 'Show expenses from this date (YYYY-MM-DD, inclusive)')
    .option('--to <date>', 'Show expenses to this date (YYYY-MM-DD, inclusive)')
    .action((options: { category?: string; from?: string; to?: string }, cmd: Command) => {
      if (options.category !== undefined && !EXPENSE_CATEGORIES.includes(options.category as ExpenseCategory)) {
        cmd.error(`Invalid category "${options.category}". Valid categories: ${EXPENSE_CATEGORIES.join(', ')}`);
      }

      const expenses = getAllExpenses();
      const filtered = filterExpenses(expenses, options);
      console.log(formatExpenseTable(filtered));
    });
}
