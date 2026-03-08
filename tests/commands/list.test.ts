import { filterExpenses } from '../../src/commands/list';
import type { Expense } from '../../src/types';

const makeExpense = (overrides: Partial<Expense>): Expense => ({
  id: 'aaaaaaaa-0000-0000-0000-000000000000',
  amount: 10,
  category: 'food',
  date: '2026-03-08',
  note: '',
  createdAt: '2026-03-08T12:00:00.000Z',
  ...overrides,
});

const E1 = makeExpense({ date: '2026-03-08', category: 'food', createdAt: '2026-03-08T10:00:00.000Z' });
const E2 = makeExpense({ date: '2026-03-07', category: 'transport', createdAt: '2026-03-07T09:00:00.000Z' });
const E3 = makeExpense({ date: '2026-03-06', category: 'food', createdAt: '2026-03-06T08:00:00.000Z' });

describe('filterExpenses', () => {
  it('returns all expenses when no filters applied', () => {
    const result = filterExpenses([E1, E2, E3], {});
    expect(result).toHaveLength(3);
  });

  it('filters by category', () => {
    const result = filterExpenses([E1, E2, E3], { category: 'food' });
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.category === 'food')).toBe(true);
  });

  it('filters by from date (inclusive)', () => {
    const result = filterExpenses([E1, E2, E3], { from: '2026-03-07' });
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.date >= '2026-03-07')).toBe(true);
  });

  it('filters by to date (inclusive)', () => {
    const result = filterExpenses([E1, E2, E3], { to: '2026-03-07' });
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.date <= '2026-03-07')).toBe(true);
  });

  it('filters by date range', () => {
    const result = filterExpenses([E1, E2, E3], { from: '2026-03-07', to: '2026-03-07' });
    expect(result).toHaveLength(1);
    expect(result[0]?.date).toBe('2026-03-07');
  });

  it('sorts by date descending', () => {
    const result = filterExpenses([E3, E1, E2], {});
    expect(result[0]?.date).toBe('2026-03-08');
    expect(result[1]?.date).toBe('2026-03-07');
    expect(result[2]?.date).toBe('2026-03-06');
  });

  it('returns empty array when no matches', () => {
    const result = filterExpenses([E1, E2, E3], { category: 'housing' });
    expect(result).toHaveLength(0);
  });
});
