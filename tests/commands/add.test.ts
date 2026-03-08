import { buildExpense } from '../../src/commands/add';
import type { AddExpenseInput } from '../../src/types';

describe('buildExpense', () => {
  const input: AddExpenseInput = {
    amount: 12.5,
    category: 'food',
    date: '2026-03-08',
    note: 'lunch',
  };

  it('creates an expense with correct fields', () => {
    const expense = buildExpense(input);
    expect(expense.amount).toBe(12.5);
    expect(expense.category).toBe('food');
    expect(expense.date).toBe('2026-03-08');
    expect(expense.note).toBe('lunch');
  });

  it('generates a valid UUID id', () => {
    const expense = buildExpense(input);
    expect(expense.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('sets createdAt to an ISO datetime string', () => {
    const before = Date.now();
    const expense = buildExpense(input);
    const after = Date.now();
    const ts = new Date(expense.createdAt).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('allows empty note', () => {
    const expense = buildExpense({ ...input, note: '' });
    expect(expense.note).toBe('');
  });
});
