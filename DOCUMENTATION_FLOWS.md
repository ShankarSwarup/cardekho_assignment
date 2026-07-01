# AutoMatch Pro - Full Stack System flows & Documentation

This document covers the entire folder structure, system architecture, functional flows, local run instructions, implementation history, and complex edge-case mitigation strategies for the AutoMatch Pro platform.

---

## 1. Monorepo Folder Structure

```
cardekho_assignment/ (Root)
├── apps/
│   ├── client/               # React SPA (Vite + TypeScript + Tailwind CSS)
│   │   ├── index.html        # Main Entry Document
│   │   ├── src/
│   │   │   ├── App.tsx       # Core Application State and UI Layout
│   │   │   ├── index.css     # Styling Entry (sleek scrollbars, gradients)
│   │   │   └── main.tsx      # React Bootstrapper
│   │   └── package.json
│   │
│   ├── server/               # Express API Core Server
│   │   ├── src/
│   │   │   ├── server.ts     # Server Initialization & Route Registration
│   │   │   ├── controllers/  # Request Handlers (Car, User, Review)
│   │   │   ├── middleware/   # Token Auths, Structured Audits, Zod Valids
│   │   │   ├── models/       # Mongoose Schemas (Car, User, Recommendation)
│   │   │   ├── repositories/ # Database Access Objects (DAOs)
│   │   │   ├── services/     # Scoring Rules Logic, Auths, Calculations
│   │   │   └── utils/        # Seed script (400 cars), API validation suites
│   │   └── package.json
│   │
│   └── advisor-service/      # Inactive placeholder (obsolete Gemini layer)
│
├── packages/
│   ├── types/                # Shared TypeScript Type Interfaces
│   │   ├── src/index.ts      # Shared structures definition file
│   │   └── package.json
│   │
│   └── utils/                # General validation helper routines
│       └── package.json
│
├── package.json              # Root-level configurations & workspace links
├── tsconfig.json             # Root-level shared tsconfig base
└── DOCUMENTATION_FLOWS.md    # This file
```

---

## 2. Functional Flows & System Architecture

### Architectural Overview

The application utilizes a **Workspaces Monorepo** where backend servers and frontend client bundles access shared schemas (`@automatch/types`) locally. Database interactions are isolated within standard DAO repositories.

```mermaid
graph TD
    Client[React SPA Client :3000] -->|HTTP Requests| Server[Express API Gateway :5000]
    Server -->|Queries| MongoDB[(MongoDB Atlas Cloud)]
    Server -->|Shared Types| TypesPackage[@automatch/types]
```

### Flow 1: Rule-Based Recommendation Scoring
Calculates matching scores out of 100 based on user budget, safety prioritizations, fuel preference, and mileage requirements.

```mermaid
sequenceDiagram
    participant User as React Client
    participant API as Express API Server
    participant DB as MongoDB Atlas

    User->>API: POST /recommendations { budget, familySize, fuel, transmission, priority }
    API->>DB: Query candidate vehicles matching basic bounds
    DB-->>API: Return candidate car array
    API->>API: Apply priority weighting score rules
    API->>API: Hydrate explanations & trade-offs
    API->>DB: Log session history (Recommendation Session)
    API-->>User: Return hydrated sorted recommendation results
```

### Flow 2: Customer Reviews CRUD (Single Review Guarantee)
Enforces a strict constraint where a user can only leave one review per vehicle. Subsequent reviews will update their existing submission instead of inserting duplicates.

```mermaid
sequenceDiagram
    participant User as React Client
    participant Auth as Auth Middleware
    participant Controller as Review Controller
    participant DB as MongoDB Atlas

    User->>Auth: POST /cars/:id/reviews { rating, review } (with JWT Bearer)
    Auth->>Controller: Authenticated userId injected
    Controller->>DB: Find review by userId AND carId
    alt Review exists
        Controller->>DB: Update existing review content & save
        DB-->>Controller: Return updated record
        Controller-->>User: HTTP 200 (Updated review payload)
    else No review exists
        Controller->>DB: Insert new review document
        DB-->>Controller: Return new record
        Controller-->>User: HTTP 201 (Created review payload)
    end
```

---

## 3. Deep Edge-Case Mitigations

### I. Race Conditions on Multi-Query Filters
*   **Problem**: In standard React applications, changing multiple filters (e.g. brand, fuel) in rapid succession triggers concurrent async fetches. If a query for filter A completes after filter B, the UI displays outdated data.
*   **Resolution**: Implemented a single, unified search `useEffect` hook in `App.tsx` tied to debounced state parameters. Catalog pagination triggers reset to page 1 automatically on any parameter shift, neutralizing async queries overlap.

### II. Parameter Erasure in Validator Middleware
*   **Problem**: The Zod validator middleware replaced `req.params` with parsed values. If a route had parameters (e.g. `:id` for reviews) but the Zod schema only validated the request body, `req.params` was completely erased, throwing 500 errors.
*   **Resolution**: Updated `validate.ts` middleware to inspect parsed schema attributes. Properties (`req.body`, `req.query`, `req.params`) are only overwritten if they are explicitly returned in the parsed output, preserving URL params.

### III. Wishlist Mismatch & Detail Card Breaks
*   **Problem**: When a user logs in, the client wishlist requires detailed price, variant, and image specifications. Querying users without population returned plain ID strings, breaking card renders.
*   **Resolution**: Hydrated the entire user session using Mongoose `.populate('wishlist')` queries inside the auth/login sequence, delivering instant render states to client views.

---

## 4. How to Run Locally

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd C:\Users\badri\OneDrive\Desktop\cardekho_assignment
   ```
2. Install all dependencies across workspaces (this will configure symlinks):
   ```bash
   npm install
   ```

### Seeding the Database
Populate the MongoDB Atlas database with 400 real-world Indian ex-showroom priced vehicles and mock accounts:
```bash
npm run seed --workspace=@automatch/server
```

### Launching Development Servers
Start the client server and backend core simultaneously:
```bash
npm run dev
```
*   **Vite Client**: `http://localhost:3000`
*   **Express API Server**: `http://localhost:5000`

---

## 5. Summary of Done Checklist

*   `[x]` Enforced single-review rule per user per vehicle. Fallbacks automatically update existing reviews in the DB.
*   `[x]` Styled thin, sleek webkit-scrollbars matching Slate dark mode.
*   `[x]` Stopped background body page scrolls when modal overlays are active.
*   `[x]` Added brand, model, make, and variant (`make model (variant)`) inside selection comparison chips.
*   `[x]` Enabled click pointer events (`cursor-pointer`) on all vehicle cards.
*   `[x]` Fixed breaking recommendation history UI by aligning schemas and frontend fields.
*   `[x]` Eradicated all occurrences of the letters "AI" from directories, variable definitions, and labels repo-wide.
