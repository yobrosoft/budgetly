import * as fs from 'fs';
import * as path from 'path';
import type { Command } from 'commander';
import type { ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../types';
import { getAllExpenses } from '../storage';
import { filterExpenses } from './list';
import { toCsv } from '../utils/csv';

export function registerExportCommand(program: Command): void {
  program
    .command('export')
    .description('Export expenses to CSV')
    .option('-o, --output <file>', 'Output file path', 'expenses.csv')
    .option('-c, --category <category>', 'Filter by category')
    .option('--from <date>', 'Filter from this date (YYYY-MM-DD, inclusive)')
    .option('--to <date>', 'Filter to this date (YYYY-MM-DD, inclusive)')
    .action((options: { output: string; category?: string; from?: string; to?: string }, cmd: Command) => {
      if (options.category !== undefined && !EXPENSE_CATEGORIES.includes(options.category as ExpenseCategory)) {
        cmd.error(`Invalid category "${options.category}". Valid categories: ${EXPENSE_CATEGORIES.join(', ')}`);
      }

      const expenses = getAllExpenses();
      const filtered = filterExpenses(expenses, options);
      const csv = toCsv(filtered);

      const outPath = path.resolve(options.output);
      fs.writeFileSync(outPath, csv, 'utf8');
      console.log(`Exported ${filtered.length} expense(s) to ${outPath}`);
    });
}
