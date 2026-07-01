# API Gateway Server - Developer Reference

This package (`apps/server`) runs the core **Node.js/Express** backend gateway connecting the client to the database and routing matching queries to the AI microservice.

---

## 1. Directory Layout & File Sitemap

*   **[`src/server.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/server.ts)**: Configures the Mongoose connection using the direct replica-set connection string and boots the HTTP server on port `5000`.
*   **[`src/app.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/app.ts)**: Declares routing chains and binds Winston logging, rate limiters, cookies, and CORS middleware.
*   **[`src/models/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/models)**: Hosts database schema files:
    *   `User.ts` (accounts + wishlists)
    *   `Car.ts` (vehicle spec properties)
    *   `Review.ts` (customer feedback records)
    *   `Recommendation.ts` (history tracking log)
*   **[`src/repositories/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/repositories)**: Abstracts raw Mongoose queries (e.g. `CarRepository.ts` finds matches by price ranges or filters).
*   **[`src/services/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/services)**:
    *   `AuthService.ts`: Performs credential authentication and issues/renews JWT tokens.
    *   `RecommendationService.ts`: Computes specification scoring and interacts with the AI service.
*   **[`src/controllers/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/controllers)**: Maps Express request params to service operations.
*   **[`src/middleware/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/middleware)**: Implements security layers (limiting, JWT decoding, logging UUID traceIds).
*   **[`src/utils/`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/utils)**: Holds testing scripts and database seed data tools.

---

## 2. Core Functional References & Standards

### A. Authentication & Security Middleware
All authenticated endpoints are guarded by the `authenticateJWT` middleware in [`security.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/middleware/security.ts):
```typescript
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};
```

### B. Accessing Key Methods

#### 1. AuthService
*   **`login(email, password)`**: Compares credentials, queries the database, and issues a signature tuple of `{ user, accessToken, refreshToken }`.
*   **`register(userData)`**: Hashes the plain-text password using `bcrypt` and creates a new database user record.

#### 2. RecommendationService
*   **`generateRecommendations(userId, preferences)`**: 
    1. Fetches all candidate vehicles.
    2. Weights them according to priorities (Budget 30%, Safety 20%, Mileage 15%, Seating 15%, Fuel 10%, Transmission 10%).
    3. Truncates pool to top 5 candidates.
    4. Forwards payload to AI Service.
    5. Stores the request session details in the `RecommendationSession` collection.

---

## 3. Integration Testing Utilities
This module contains utility files to debug database and API routes locally:
1.  **[`seed.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/utils/seed.ts)**: Seeds dummy vehicles, reviews, and test user `john@example.com` / `Password@123`.
2.  **[`test_recommendations.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/utils/test_recommendations.ts)**: Checks the backend rules filter pipeline and calls the AI service directly.
3.  **[`test_api_endpoint.ts`](file:///C:/Users/badri/OneDrive/Desktop/cardekho_assignment/apps/server/src/utils/test_api_endpoint.ts)**: Fully executes user login, token retrieval, and authenticated request routing.
