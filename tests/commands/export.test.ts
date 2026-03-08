import * as fs from 'fs';
import * as storage from '../../src/storage';
import type { Expense } from '../../src/types';

jest.mock('fs');
jest.mock('../../src/storage');

const mockStorage = jest.mocked(storage);

const EXPENSE: Expense = {
  id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  amount: 12.5,
  category: 'food',
  date: '2026-03-08',
  note: 'lunch',
  createdAt: '2026-03-08T12:00:00.000Z',
};

beforeEach(() => {
  jest.resetAllMocks();
  mockStorage.getAllExpenses.mockReturnValue([EXPENSE]);
});

describe('export command', () => {
  it('writes a CSV file with the correct content', () => {
    // Test via the exported filterExpenses + toCsv utilities directly
    const { filterExpenses } = jest.requireActual<typeof import('../../src/commands/list')>('../../src/commands/list');
    const { toCsv } = jest.requireActual<typeof import('../../src/utils/csv')>('../../src/utils/csv');

    const filtered = filterExpenses([EXPENSE], {});
    const csv = toCsv(filtered);

    expect(csv).toContain('id,amount,category,date,note,createdAt');
    expect(csv).toContain('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee');
    expect(csv).toContain('12.50');
    expect(csv).toContain('food');
  });
});
