# Budgetly — Claude Instructions

## Stack
- **TypeScript** with strict mode enabled (`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **commander** for all CLI command definitions
- **ts-node** for development execution; `tsc` compiles to `dist/`

## Data
- Persist all expense data in `data/expenses.json`
- All dates must be ISO strings: `YYYY-MM-DD` for user-facing dates, full ISO 8601 datetime for `createdAt`
- Never use `Date` objects in stored data — serialize to/from strings at the I/O boundary only

## Workflow
1. **Before every commit:** run `npm test` and ensure all tests pass
2. **After any feature, fix, or change is complete and tested:** create a conventional commit and push to origin main
   - Commit format: `<type>(<scope>): <description>` (e.g. `feat(add): validate date format`, `fix(storage): handle corrupt json`)
   - Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`
3. Never commit with failing tests
