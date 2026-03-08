import { toCsv } from '../../src/utils/csv';
import type { Expense } from '../../src/types';

const makeExpense = (overrides: Partial<Expense>): Expense => ({
  id: 'aaaaaaaa-0000-0000-0000-000000000000',
  amount: 10.0,
  category: 'food',
  date: '2026-03-08',
  note: '',
  createdAt: '2026-03-08T12:00:00.000Z',
  ...overrides,
});

describe('toCsv', () => {
  it('produces correct header row', () => {
    const csv = toCsv([]);
    const firstLine = csv.split('\n')[0];
    expect(firstLine).toBe('id,amount,category,date,note,createdAt');
  });

  it('returns only header for empty array', () => {
    const csv = toCsv([]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(1);
  });

  it('formats amount to 2 decimal places', () => {
    const csv = toCsv([makeExpense({ amount: 5 })]);
    expect(csv).toContain('5.00');
  });

  it('produces one data row per expense', () => {
    const csv = toCsv([makeExpense({}), makeExpense({})]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
  });

  it('wraps cell in double-quotes when it contains a comma', () => {
    const csv = toCsv([makeExpense({ note: 'coffee, tea' })]);
    expect(csv).toContain('"coffee, tea"');
  });

  it('escapes double-quotes inside a cell', () => {
    const csv = toCsv([makeExpense({ note: 'she said "hi"' })]);
    expect(csv).toContain('"she said ""hi"""');
  });

  it('wraps cell in double-quotes when it contains a newline', () => {
    const csv = toCsv([makeExpense({ note: 'line1\nline2' })]);
    expect(csv).toContain('"line1\nline2"');
  });

  it('does not quote plain cells', () => {
    const csv = toCsv([makeExpense({ note: 'simple' })]);
    expect(csv).not.toContain('"simple"');
  });
});
