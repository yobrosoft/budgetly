import { formatExpenseTable, formatTotalsTable } from '../../src/utils/format';
import type { Expense, ExpenseCategory } from '../../src/types';

const makeExpense = (overrides: Partial<Expense>): Expense => ({
  id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  amount: 10.0,
  category: 'food',
  date: '2026-03-08',
  note: 'test note',
  createdAt: '2026-03-08T12:00:00.000Z',
  ...overrides,
});

describe('formatExpenseTable', () => {
  it('returns "No expenses found." for empty array', () => {
    expect(formatExpenseTable([])).toBe('No expenses found.');
  });

  it('renders header row with expected column names', () => {
    const output = formatExpenseTable([makeExpense({})]);
    expect(output).toContain('ID');
    expect(output).toContain('DATE');
    expect(output).toContain('CATEGORY');
    expect(output).toContain('AMOUNT');
    expect(output).toContain('NOTE');
  });

  it('shows only the first 8 characters of the UUID', () => {
    const output = formatExpenseTable([makeExpense({})]);
    expect(output).toContain('aaaaaaaa');
    expect(output).not.toContain('aaaaaaaa-bbbb');
  });

  it('formats amount with dollar sign and 2 decimal places', () => {
    const output = formatExpenseTable([makeExpense({ amount: 7.5 })]);
    expect(output).toContain('$7.50');
  });

  it('renders 3 lines minimum (header + sep + row) for one expense', () => {
    const output = formatExpenseTable([makeExpense({})]);
    const lines = output.split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });
});

describe('formatTotalsTable', () => {
  it('returns "No expenses found." for empty map', () => {
    expect(formatTotalsTable(new Map(), 0)).toBe('No expenses found.');
  });

  it('renders CATEGORY and AMOUNT headers', () => {
    const totals = new Map<ExpenseCategory, number>([['food', 1250]]);
    const output = formatTotalsTable(totals, 1250);
    expect(output).toContain('CATEGORY');
    expect(output).toContain('AMOUNT');
  });

  it('renders the grand total row', () => {
    const totals = new Map<ExpenseCategory, number>([['food', 1000], ['transport', 500]]);
    const output = formatTotalsTable(totals, 1500);
    expect(output).toContain('TOTAL');
    expect(output).toContain('$15.00');
  });

  it('shows each category in the table', () => {
    const totals = new Map<ExpenseCategory, number>([
      ['food', 2000],
      ['housing', 1000],
    ]);
    const output = formatTotalsTable(totals, 3000);
    expect(output).toContain('food');
    expect(output).toContain('housing');
  });
});
