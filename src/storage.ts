import * as fs from 'fs';
import * as path from 'path';
import type { Expense, ExpenseStore } from './types';

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'expenses.json');

function isExpenseStore(v: unknown): v is ExpenseStore {
  return (
    typeof v === 'object' &&
    v !== null &&
    (v as Record<string, unknown>)['version'] === 1 &&
    Array.isArray((v as Record<string, unknown>)['expenses'])
  );
}

export function readStore(): ExpenseStore {
  if (!fs.existsSync(DATA_FILE)) {
    return { version: 1, expenses: [] };
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (isExpenseStore(parsed)) {
      return parsed;
    }
    process.stderr.write('Warning: expenses.json is malformed, starting fresh.\n');
    return { version: 1, expenses: [] };
  } catch {
    process.stderr.write('Warning: could not read expenses.json, starting fresh.\n');
    return { version: 1, expenses: [] };
  }
}

export function writeStore(store: ExpenseStore): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

export function getAllExpenses(): Expense[] {
  return readStore().expenses;
}

export function addExpense(expense: Expense): void {
  const store = readStore();
  writeStore({ ...store, expenses: [...store.expenses, expense] });
}
