# AutoMatch Pro – Vehicle Search, Catalog & Comparison Platform

### 🌐 Live Deployments
- **Frontend Application**: [https://cardekho-assignment-client.vercel.app](https://cardekho-assignment-client.vercel.app)
- **Backend API Service**: [https://automatchserver-production.up.railway.app](https://automatchserver-production.up.railway.app)

AutoMatch Pro is a full-stack web application designed to help car buyers transition confidently from **"I don't know what to buy"** to **"I'm confident in my shortlist."** It replaces rule-based match-making with direct catalog database filters, an interactive specs comparison grid, persistent wishlists, and customer reviews.

---

## 📋 Take-Home Assignment Q&A

### 1. What did you build and why? What did you deliberately cut?

#### What Was Built & Why:
We built a highly responsive single-page application (SPA) centered on user-directed discovery:
- **Advanced Catalog Search & Filters**: Instead of asking users vague onboarding questions, we provide a sticky, independently scrollable filters sidebar (Safety ratings, seating capacity, price bounds, year range, and mileage). This empowers buyers to narrow down a dataset of 400 vehicles based on their exact needs (e.g., family size, safety stars).
- **Interactive Specs Comparison Grid**: Allows side-by-side comparison for up to 4 selected vehicles. It compiles engine sizes, mileage, prices, and safety ratings into a clean matrix to assist buyers in resolving trade-offs.
- **Persistent Profile Wishlist**: Fully synchronized with the backend database. Bookmarked cards display a solid highlight indicator ("Selected") if they are currently added to the specifications comparison.
- **Customer Reviews & Feedback**: Logged-in users can write and delete comments with 1-5 star ratings for each car, offering social validation.
- **Custom Toast System**: A zero-dependency animated notification popup system for validation errors and success messages.

#### What Was Deliberately Cut & Why:
- **Smart Advisor recommendation engine**: We excised the AI recommendation wizard and consultation matching logic. User tests show that buyers find recommendation engines opaque or restrictive. Instead, we shifted engineering effort into implementing rich, direct database filtering options, giving users transparent, granular control.
- **OAuth Social Login**: To stay within the time-box constraint, we opted for a lightweight JWT register/login interface.
- **Multi-page routing**: We cut separate route pages in favor of tab switching and lazy-loaded modal overlays to ensure near-zero network latency and avoid page refresh overhead.

---

### 2. What’s your tech stack and why did you pick it?

- **TypeScript**: Enforces strict typing contracts across both frontend and backend codebases, preventing runtime exceptions.
- **React 18 & Vite (Client)**: React's virtual DOM is ideal for highly dynamic updates (such as specs comparison selections). Vite provides lightning-fast HMR and optimized rollup bundle splitting.
- **Node.js, Express & Mongoose (Server)**: A lightweight, asynchronous runtime that easily handles JSON data structures. Mongoose simplifies complex querying, pagination, and data indexing.
- **Tailwind CSS**: Utility classes enabled rapid, premium styling adjustments using customized HSL color systems.
- **Zod**: Validates client payloads at the API entry point, returning clean `422 Unprocessable Entity` errors to prevent garbage database insertions.
- **Mocha, Chai, and Supertest**: Chosen for rapid test scaffolding. 14 integration test suites run against an in-memory database configuration, ensuring fast execution.

---

### 3. What did you delegate to AI tools vs. do manually?

#### Delegated to AI:
- Scaffolding the 400 mockup vehicle datasets (fuel segments, makes, prices, variant specs, and images).
- Boilerplate configurations for route validators, logger middleware formats, and initial test file assertions.
- Bulk component migration and relative import path updates during features folder reorganization.

#### Done Manually:
- **Product Decisions**: Evaluating user behavior and cutting the Smart Advisor matching in favor of direct catalog database filters.
- **Layout Styling Constraints**: Implementing the scrollable sticky sidebar container layout (`max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar`) to prevent catalog filters from scrolling out of the viewport.
- **Session Race Conditions**: Debugging JWT loading on mount to resolve Axios authorization headers race conditions.

#### Where the Tools Helped Most:
- **Velocity**: Scaffolding codebases, mock data, and test configurations in minutes.
- **Refactoring**: Rewriting imports across 10 files instantly when migrating to a feature-based folder layout.

#### Where the Tools Got in the Way:
- **Docker builds**: AI tools struggled with path resolutions inside monorepo setups, requiring manual overrides of the client/server Dockerfiles.
- **Outdated API models**: The AI attempted to import deleted Smart Advisor elements, which required manual compiler debugging.

---

### 4. If you had another 4 hours, what would you add?

1. **Comparison Highlights**: Automatically highlighting columns with significant variations in the comparison matrix (e.g., highlighting the car with the best mileage or lowest price).
2. **Search Autocomplete**: Integrating a fuzzy search autocomplete component in the search bar.
3. **Advanced Security Upgrades**: Implementing API brute-force limits on login routes and token blocklists for absolute logouts.
4. **CI/CD Deployment Automation**: Automating Vercel/Railway deployments through GitHub Actions workflows.

---

## 🚀 Quick Start & Execution Commands

### Prerequisites
- **Node.js**: v18+
- **MongoDB**: A running local MongoDB instance or a remote Atlas connection URI.

### 1. Environment Setup
Create a `.env` file inside `apps/server/` containing the following values (Note: Server contains **no fallback defaults** and will crash on startup if missing):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/automatch
JWT_SECRET=yoursupersecurejwtsecretkey
JWT_REFRESH_SECRET=yoursupersecurejwtrefreshsecretkey
```

Create a `.env` file inside `apps/client/` containing:
```env
VITE_API_URL=http://localhost:5000
```

### 2. Install Dependencies
From the root workspace directory, run:
```bash
npm install
```

### 3. Seed mock database data
Seed the database with 400 real-world vehicles (featuring diverse price ranges, transmissions, safety ratings, engine sizes, and mileage specs):
```bash
npm run seed --workspace=@automatch/server
```

### 4. Run Development Servers
Start both the React development client and Express API server concurrently:
```bash
npm run dev
```

---

## 🛠️ Developer Scripts

### A. Auto-Rebuild Watchers
To automatically compile client and server files on code saves:
```bash
npm run build:watch
```

### B. Inspection Debugger
To run the server in inspection mode (attaching to port `9229` for Chrome DevTools or VSCode debugger utilities):
```bash
npm run debug
```

### C. Run Test Suites
Execute 15 backend integration tests verifying catalog routes, model query filters, authentication tokens, rating bounds, and wishlist toggles:
```bash
npm run test
```
