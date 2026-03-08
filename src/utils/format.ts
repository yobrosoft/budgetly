import type { Expense, ExpenseCategory } from '../types';

function colWidth(header: string, values: string[]): number {
  return Math.max(header.length, ...values.map((v) => v.length));
}

function pad(value: string, width: number): string {
  return value.padEnd(width, ' ');
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

export function formatExpenseTable(expenses: readonly Expense[]): string {
  if (expenses.length === 0) {
    return 'No expenses found.';
  }

  const ids = expenses.map((e) => shortId(e.id));
  const dates = expenses.map((e) => e.date);
  const cats = expenses.map((e) => e.category);
  const amounts = expenses.map((e) => `$${e.amount.toFixed(2)}`);
  const notes = expenses.map((e) => e.note);

  const wId = colWidth('ID', ids);
  const wDate = colWidth('DATE', dates);
  const wCat = colWidth('CATEGORY', cats);
  const wAmt = colWidth('AMOUNT', amounts);
  const wNote = colWidth('NOTE', notes);

  const sep = [wId, wDate, wCat, wAmt, wNote].map((w) => '-'.repeat(w)).join('  ');
  const header = [
    pad('ID', wId),
    pad('DATE', wDate),
    pad('CATEGORY', wCat),
    pad('AMOUNT', wAmt),
    pad('NOTE', wNote),
  ].join('  ');

  const rows = expenses.map((e, i) =>
    [
      pad(ids[i] ?? '', wId),
      pad(dates[i] ?? '', wDate),
      pad(cats[i] ?? '', wCat),
      pad(amounts[i] ?? '', wAmt),
      pad(notes[i] ?? '', wNote),
    ].join('  ')
  );

  return [header, sep, ...rows].join('\n');
}

export function formatTotalsTable(
  totals: ReadonlyMap<ExpenseCategory, number>,
  grandTotal: number
): string {
  if (totals.size === 0) {
    return 'No expenses found.';
  }

  const cats = [...totals.keys()];
  const amounts = [...totals.values()].map((v) => `$${(v / 100).toFixed(2)}`);
  const grandStr = `$${(grandTotal / 100).toFixed(2)}`;

  const wCat = colWidth('CATEGORY', [...cats, 'TOTAL']);
  const wAmt = colWidth('AMOUNT', [...amounts, grandStr]);

  const sep = [wCat, wAmt].map((w) => '-'.repeat(w)).join('  ');
  const header = [pad('CATEGORY', wCat), pad('AMOUNT', wAmt)].join('  ');

  const rows = cats.map((cat, i) =>
    [pad(cat, wCat), pad(amounts[i] ?? '', wAmt)].join('  ')
  );

  const footer = [pad('TOTAL', wCat), pad(grandStr, wAmt)].join('  ');

  return [header, sep, ...rows, sep, footer].join('\n');
}
