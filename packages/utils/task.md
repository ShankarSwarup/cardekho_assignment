# packages/utils - Task Summary

## What Was Done

- Shared utility functions in `@automatch/utils`:
  - `validateEmail(email: string): boolean`
  - `formatCurrency(price: number): string` (INR formatting)
  - `sanitizeString(input: string): string`

## Coding Standards

- Pure functions with no side effects.
- Exported from single `src/index.ts` entry point.
- Used by server; client duplicates `formatCurrency` locally in `App.tsx`.

## Test Cases Covered

- No automated tests.

## Gaps / Not Yet Covered

- Client duplicates `formatCurrency` instead of importing from `@automatch/utils`.
- No unit tests for email validation edge cases.
- `sanitizeString` usage not verified across all user input paths.
