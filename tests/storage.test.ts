import * as fs from 'fs';
import { readStore, writeStore, getAllExpenses, addExpense } from '../src/storage';
import type { Expense } from '../src/types';

jest.mock('fs');
const mockFs = jest.mocked(fs);

const MOCK_EXPENSE: Expense = {
  id: 'aaaaaaaa-0000-0000-0000-000000000000',
  amount: 12.5,
  category: 'food',
  date: '2026-03-08',
  note: 'lunch',
  createdAt: '2026-03-08T12:00:00.000Z',
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('readStore', () => {
  it('returns empty store when file does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);
    const store = readStore();
    expect(store).toEqual({ version: 1, expenses: [] });
  });

  it('parses valid JSON from disk', () => {
    mockFs.existsSync.mockReturnValue(true);
    const stored = { version: 1, expenses: [MOCK_EXPENSE] };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored) as unknown as Buffer);
    const store = readStore();
    expect(store.version).toBe(1);
    expect(store.expenses).toHaveLength(1);
    expect(store.expenses[0]).toEqual(MOCK_EXPENSE);
  });

  it('returns empty store when JSON is malformed', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue('not json' as unknown as Buffer);
    const store = readStore();
    expect(store.expenses).toHaveLength(0);
  });

  it('returns empty store when JSON has wrong shape', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ wrong: true }) as unknown as Buffer);
    const store = readStore();
    expect(store.expenses).toHaveLength(0);
  });
});

describe('writeStore', () => {
  it('writes to a .tmp file then renames atomically', () => {
    const store = { version: 1 as const, expenses: [] };
    writeStore(store);
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('.tmp'),
      expect.any(String),
      'utf8'
    );
    expect(mockFs.renameSync).toHaveBeenCalled();
  });

  it('creates the data directory if needed', () => {
    const store = { version: 1 as const, expenses: [] };
    writeStore(store);
    expect(mockFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
  });
});

describe('getAllExpenses', () => {
  it('returns expenses array from store', () => {
    mockFs.existsSync.mockReturnValue(true);
    const stored = { version: 1, expenses: [MOCK_EXPENSE] };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(stored) as unknown as Buffer);
    const expenses = getAllExpenses();
    expect(expenses).toHaveLength(1);
    expect(expenses[0]).toEqual(MOCK_EXPENSE);
  });
});

describe('addExpense', () => {
  it('appends a new expense to the store', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify({ version: 1, expenses: [] }) as unknown as Buffer
    );
    addExpense(MOCK_EXPENSE);
    expect(mockFs.writeFileSync).toHaveBeenCalled();
    const written = (mockFs.writeFileSync as jest.Mock).mock.calls[0]?.[1] as string;
    const parsed = JSON.parse(written) as { expenses: Expense[] };
    expect(parsed.expenses).toHaveLength(1);
    expect(parsed.expenses[0]?.id).toBe(MOCK_EXPENSE.id);
  });
});
