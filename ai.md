# AI Collaboration & Tool Usage (ai.md)

This document explains the work completed in collaboration with AI tools, highlighting the tasks delegated, issues encountered, and technical workarounds implemented during the development of the **AutoMatch Pro** platform.

---

## 1. Work Delegated to AI Tools

We leveraged AI agentic workflows (via Antigravity / Gemini) to accelerate the scaffolding and refactoring of the platform:

- **Mock Dataset Scaffolding**: Generated a diverse dataset of 400 real-world vehicles (makes, models, engine cc, mileage, prices, safety NCAP stars, seating capacity) using random seeding logic.
- **Refactoring Feature Folder Organization**: Reorganized generic client contexts and components into self-contained feature subfolders (`features/auth`, `features/cars`, `features/compare`, `features/wishlist`, `features/toast`). The AI automatically rewrote relative imports across 12 source files instantly.
- **Integration Tests Suite Setup**: Generated Mocha, Chai, and Supertest templates covering 15 test cases (authentication, catalog pages, brand-model filters, wishlist actions, rating bounds checks).
- **Mermaid Workflow Diagrams**: Scaffolded visual sequence and flow charts mapping authentication, catalog filtering, wishlist saving, spec comparisons, and reviews submission.

---

## 2. Technical Issues Faced & Workarounds

While AI tools dramatically increased velocity, several compilation, runtime, and logical challenges arose, requiring manual course-correction:

### A. Docker Container Compilations (Monorepo Workspaces)
- **The Issue**: The AI initially wrote standalone client and server Dockerfiles using implicit parent workspace directories paths (`packages/` or `@automatch/`), which caused build processes to crash on Railway because monorepo layouts were not resolved inside isolated build contexts.
- **The Workaround**: Refactored the `Dockerfiles` to copy `package*.json` files directly to the build WORKDIR, run `npm ci` under workspaces, and compile using exact path directories mapping, completely eliminating resolution failures.

### B. Initial Mount 401 Unauthorized Race Conditions
- **The Issue**: On startup or reload, the app mounted and immediately queried the user's wishlist and consultation logs. The AI set the Axios Authorization header globally in a `useEffect` hook, but a race condition caused the initial mounts to dispatch requests *before* the Axios default header was applied, resulting in immediate `401 Unauthorized` API errors.
- **The Workaround**: Modified `fetchWishlist` to accept an explicit `token` argument passed directly as an authorization bearer header parameter on mounting, bypassing global state race conditions.

### C. Image Carousel Index Out-of-Bounds Exception
- **The Issue**: When clicking through images inside the vehicle details carousel, the active image index (`currentImgIdx`) state was preserved. If a user scrolled to image index `3` on a car with 4 images, closed the modal, and opened a car with only 1 image, the UI crashed on an out-of-bounds array access.
- **The Workaround**: Introduced a reactive `useEffect` monitoring `selectedCar?._id` that automatically resets `currentImgIdx` to `0` whenever a new vehicle is selected.

### D. Client-Side API Base URL Duplication
- **The Issue**: After updating the client `.env` to include the Railway domain `https://automatchserver-production.up.railway.app/api/v1`, the AI continued appending `/api/v1` within the codebase, resulting in invalid target queries (`/api/v1/api/v1`) that returned 404 responses.
- **The Workaround**: Corrected context variables to utilize standard fallback evaluations: `const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';`.

### E. Platform Command Execution Constraints
- **The Issue**: Standard tool commands (such as RIPGREP or custom search utilities) failed due to host PATH missing executables or CLI command differences.
- **The Workaround**: Manually navigated folders using Node-native modules and workspace scripts to verify import maps and compilation states.
