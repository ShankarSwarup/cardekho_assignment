# Shared Utilities Package - Developer Reference

This package (`packages/utils`) contains shared utility logic, validators, parser helpers, and formatting methods utilized across external workspaces in the monorepo.

---

## 1. Directory Structure & Expositions

*   **[`src/index.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/packages/utils/src/index.ts)**: Exposes functions:
    *   `formatCurrency(amount)`: Formats numeric prices to Indian Rupee (INR) representation strings (e.g. ₹15,00,000) using custom locale definitions.
    *   `sanitizeString(input)`: Strips tags, trims spaces, and sanitizes user input parameters.
    *   `validatePreferences(payload)`: Basic logic validators checking boundary inputs (pricing thresholds, passenger seating parameters).

---

## 2. Compilation Rules
Ensure you compile changes in this directory by executing:
```bash
npm run build --workspace=@automatch/utils
```
This distributes updated common helpers to the client and server application builds.
