import type { Expense } from '../types';

const HEADERS = ['id', 'amount', 'category', 'date', 'note', 'createdAt'];

function csvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

export function toCsv(expenses: readonly Expense[]): string {
  const rows = expenses.map((e) => [
    e.id,
    e.amount.toFixed(2),
    e.category,
    e.date,
    e.note,
    e.createdAt,
  ]);
  return [HEADERS, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}
