#!/usr/bin/env node
import { program } from 'commander';
import { registerAddCommand } from './commands/add';
import { registerListCommand } from './commands/list';
import { registerTotalsCommand } from './commands/totals';
import { registerExportCommand } from './commands/export';

program
  .name('budgetly')
  .description('CLI expense tracker')
  .version('1.0.0');

registerAddCommand(program);
registerListCommand(program);
registerTotalsCommand(program);
registerExportCommand(program);

program.parse(process.argv);
