import { computeTotals } from '../../src/commands/totals';
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

describe('computeTotals', () => {
  it('returns empty map and zero total for empty list', () => {
    const { totals, grandTotal } = computeTotals([]);
    expect(totals.size).toBe(0);
    expect(grandTotal).toBe(0);
  });

  it('groups expenses by category and sums in cents', () => {
    const expenses = [
      makeExpense({ category: 'food', amount: 10.0 }),
      makeExpense({ category: 'food', amount: 5.5 }),
      makeExpense({ category: 'transport', amount: 8.0 }),
    ];
    const { totals } = computeTotals(expenses);
    expect(totals.get('food')).toBe(1550); // 10.00 + 5.50 = 15.50 → 1550 cents
    expect(totals.get('transport')).toBe(800);
  });

  it('computes correct grand total in cents', () => {
    const expenses = [
      makeExpense({ category: 'food', amount: 10.0 }),
      makeExpense({ category: 'transport', amount: 8.0 }),
    ];
    const { grandTotal } = computeTotals(expenses);
    expect(grandTotal).toBe(1800);
  });

  it('avoids floating point drift with 0.1 + 0.2', () => {
    const expenses = [
      makeExpense({ category: 'food', amount: 0.1 }),
      makeExpense({ category: 'food', amount: 0.2 }),
    ];
    const { totals } = computeTotals(expenses);
    expect(totals.get('food')).toBe(30); // 30 cents exactly
  });

  it('sorts categories by total descending', () => {
    const expenses = [
      makeExpense({ category: 'transport', amount: 5.0 }),
      makeExpense({ category: 'food', amount: 20.0 }),
      makeExpense({ category: 'housing', amount: 10.0 }),
    ];
    const { totals } = computeTotals(expenses);
    const keys = [...totals.keys()];
    expect(keys[0]).toBe('food');
    expect(keys[1]).toBe('housing');
    expect(keys[2]).toBe('transport');
  });
});
