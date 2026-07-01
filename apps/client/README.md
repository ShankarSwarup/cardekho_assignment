# React Client Application - Developer Reference

This package (`apps/client`) runs the interactive glassmorphism dashboard built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 1. Directory Structure

*   **[`src/App.tsx`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/client/src/App.tsx)**: Single-page application entrypoint containing global state, Tailwind theme wrappers, Axios configuration interceptors, catalog filters, the Recommendation Wizard form, and comparison matrices.
*   **[`src/main.tsx`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/client/src/main.tsx)**: Bootstrap rendering mounting React onto the browser DOM.
*   **[`src/index.css`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/client/src/index.css)**: Implements CSS custom variables for glassmorphism panels, card shadow elevations, and backdrop blurs.

---

## 2. Key Client Flows & State Management

### A. Axios Interceptor Architecture
All HTTP requests to the backend server are made using a pre-configured Axios instance. It handles automatic credential injection and JWT token attachments:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### B. Accessing Core Component Functions
All functions are declared within functional scopes for state encapsulation:

#### 1. Catalogue Querying & Filtering
*   **`fetchCars(filters)`**: Triggered on catalogue load and filter sidebar tweaks. Performs a `GET /cars` request with URL search parameters (body type, price range, transmission, fuel, sort order, and page offsets).
*   **`handleShortlistToggle(carId)`**: Appends or removes a vehicle from the current user's database wishlist array (via `POST /cars/wishlist`).

#### 2. Spec Comparison Grid (Max 4 Cars)
*   **`toggleCompare(car)`**: Manages a local comparison state array (`compareList`). Enforces a strict specification layout limit of maximum 4 vehicles.
*   **`renderCompareMatrix()`**: Evaluates and prints structural side-by-side spec properties (price, safety rating, engine capacity, mileage, torque) for visual contrast.

#### 3. Recommendation Wizard
*   **`handleWizardSubmit(preferences)`**: Submits structured questionnaire values (budget, daily mileage, seating capacity, fuel, transmission, priority) to the `/recommendations` API. Saves results to local state hooks for display.

---

## 3. Styling Standards
*   Use curated Tailwind classes targeting backdrop blurs, border highlights, and transparent gradients (`bg-slate-900/60 backdrop-blur-md border border-slate-700/50`).
*   Typography relies on the Outfit or Inter Google Fonts family.
