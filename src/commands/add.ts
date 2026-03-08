import { InvalidArgumentError } from 'commander';
import { randomUUID } from 'crypto';
import type { Command } from 'commander';
import type { AddExpenseInput, Expense, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../types';
import { addExpense } from '../storage';

function parseAmount(value: string): number {
  const n = parseFloat(value);
  if (isNaN(n) || n <= 0) {
    throw new InvalidArgumentError('Amount must be a positive number.');
  }
  if (Math.round(n * 100) !== n * 100) {
    throw new InvalidArgumentError('Amount must have at most 2 decimal places.');
  }
  return n;
}

function todayDate(): string {
  return new Date().toISOString().split('T')[0] as string;
}

export function buildExpense(input: AddExpenseInput): Expense {
  return {
    id: randomUUID(),
    amount: input.amount,
    category: input.category,
    date: input.date,
    note: input.note,
    createdAt: new Date().toISOString(),
  };
}

export function registerAddCommand(program: Command): void {
  program
    .command('add')
    .description('Add a new expense')
    .argument('<amount>', 'Expense amount (positive number)', parseAmount)
    .option('-c, --category <category>', 'Category (food, transport, housing, entertainment, health, utilities, other)', 'other')
    .option('-d, --date <date>', 'Date in YYYY-MM-DD format (default: today)')
    .option('-n, --note <note>', 'Optional note', '')
    .action((amount: number, options: { category: string; date?: string; note: string }, cmd: Command) => {
      if (!EXPENSE_CATEGORIES.includes(options.category as ExpenseCategory)) {
        cmd.error(`Invalid category "${options.category}". Valid categories: ${EXPENSE_CATEGORIES.join(', ')}`);
      }

      const date = options.date ?? todayDate();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime())) {
        cmd.error('Date must be in YYYY-MM-DD format (e.g. 2026-03-08).');
      }

      const expense = buildExpense({
        amount,
        category: options.category as ExpenseCategory,
        date,
        note: options.note,
      });

      addExpense(expense);
      console.log(`Added #${expense.id.slice(0, 8)} — $${expense.amount.toFixed(2)} [${expense.category}] on ${expense.date}`);
    });
}
