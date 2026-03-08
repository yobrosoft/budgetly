import type { Command } from 'commander';
import type { Expense, ExpenseCategory } from '../types';
import { getAllExpenses } from '../storage';
import { filterExpenses } from './list';
import { formatTotalsTable } from '../utils/format';

export function computeTotals(expenses: Expense[]): {
  totals: Map<ExpenseCategory, number>;
  grandTotal: number;
} {
  const totals = new Map<ExpenseCategory, number>();

  for (const e of expenses) {
    const cents = Math.round(e.amount * 100);
    const current = totals.get(e.category) ?? 0;
    totals.set(e.category, current + cents);
  }

  // Sort by total descending
  const sorted = new Map(
    [...totals.entries()].sort(([, a], [, b]) => b - a)
  );

  const grandTotal = [...sorted.values()].reduce((sum, v) => sum + v, 0);

  return { totals: sorted, grandTotal };
}

export function registerTotalsCommand(program: Command): void {
  program
    .command('totals')
    .description('Show totals by category')
    .option('--from <date>', 'Filter from this date (YYYY-MM-DD, inclusive)')
    .option('--to <date>', 'Show totals to this date (YYYY-MM-DD, inclusive)')
    .action((options: { from?: string; to?: string }) => {
      const expenses = getAllExpenses();
      const filtered = filterExpenses(expenses, options);
      const { totals, grandTotal } = computeTotals(filtered);
      console.log(formatTotalsTable(totals, grandTotal));
    });
}
