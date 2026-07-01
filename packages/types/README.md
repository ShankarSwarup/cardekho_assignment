# Shared TypeScript Types Package - Developer Reference

This package (`packages/types`) hosts shared TypeScript interfaces, entities, and data transfer definitions (DTOs) used across both the frontend React client and the backend server.

---

## 1. Package Contents & Sitemap

*   **[`src/index.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/packages/types/src/index.ts)**: Declares all types. Key interfaces include:
    *   `Car`: Specifies schema types for vehicle specs (make, model, variant, engine, seating capacity, price, safetyRating, mileage, bodyType, transmission, fuelType).
    *   `User`: Specifies account properties, role scopes (`'user' | 'admin'`), and wishlist arrays.
    *   `Review`: Defines relations between Users and Cars with rating metrics.
    *   `RecommendationSession`: Logs recommendations history.
    *   `RecommendationWizardInput`: Schema payload sent during client submissions.

---

## 2. Coding Guidelines
*   Always compile this package (`npm run build --workspace=@automatch/types`) whenever type modifications are introduced so they distribute to external node workspaces.
*   Interfaces should represent exact database schemas as well as client-facing REST responses to prevent type mismatches.
