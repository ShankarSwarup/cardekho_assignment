# AutoMatch Pro – Application Flows & Lifecycle Documentation

This document describes the end-to-end flows, pipelines, request lifecycles, and sequence diagrams for the **AutoMatch Pro** platform, compiled from the enterprise design and system documentation. It serves as a visual and descriptive reference for developers, testers, and architects working on the platform.

---

## Table of Contents
1. [Overall System Flow](#1-overall-system-flow)
2. [Request Lifecycle & Data Flow](#2-request-lifecycle--data-flow)
3. [Authentication Flow](#3-authentication-flow)
4. [Smart Recommendation Flow & Pipeline](#4-recommendation-flow--pipeline)
5. [Search & Discovery Flow](#5-search--discovery-flow)
6. [Car Comparison Flow](#6-car-comparison-flow)
7. [Wishlist Flow](#7-wishlist-flow)
8. [Refresh Token Flow](#8-refresh-token-flow)
9. [Error Handling Flow](#9-error-handling-flow)
10. [Git Workflow & CI/CD Pipeline](#10-git-workflow--cicd-pipeline)

---

## 1. Overall System Flow
The overall system flow represents the main user paths through the AutoMatch Pro application, from entering the platform to finalizing their shortlisted cars.

```mermaid
flowchart TD
    User([User]) --> LP[Landing Page]
    
    LP --> Search[Search & Filter Cars]
    LP --> AskRec[Ask Smart Recommendation]
    LP --> Browse[Browse by Categories]
    
    Search --> RecommendEngine[Recommendation Engine]
    AskRec --> RecommendEngine
    Browse --> RecommendEngine
    
    RecommendEngine --> Shortlist[Ranked Shortlisted Cars]
    
    Shortlist --> Compare[Side-by-Side Comparison]
    Shortlist --> Details[Car Details View]
    
    Compare --> Wishlist[Save to Wishlist]
    Details --> Wishlist
```

---

## 2. Request Lifecycle & Data Flow
This details the lifecycle of a request as it passes from the client browser interface down to the database and back. All requests pass through standardized layers ensuring logging, security, authentication, and validation.

```mermaid
graph TD
    Browser["Client Browser (React Form)"] --> Router["React Router (Routing)"]
    Router --> RQ["React Query (Server State Cache)"]
    Axios["Axios Client (Interceptors: JWT, 401 Response, Errors)"] --> Route["Express Route Endpoint"]
    Route --> Logger["Request Logger (Winston with traceId)"]
    Logger --> Limiter["Rate Limiter Middleware"]
    Limiter --> Security["Security Headers (Helmet / CORS)"]
    Security --> Auth["Authentication Middleware (JWT verification)"]
    Auth --> Validation["Validation Middleware (Zod schema checking)"]
    Validation --> Controller["Controller (Parse request, delegate logic)"]
    Controller --> Service["Service Layer (Business logic, transactions, scoring orchestration)"]
    Service --> Repo["Repository Layer (Mongoose queries)"]
    Repo --> DB[(MongoDB Atlas Database)]
    
    %% Response path
    DB --> Repo
    Repo --> Service
    Service --> Controller
    Controller --> Format["Response Formatter (Standard JSON response)"]
    Format --> Axios
    Axios --> RQ
    RQ --> UI["React UI Render / Update"]
```

---

## 3. Authentication Flow
The authentication flow utilizes secure JSON Web Tokens (JWT) with access tokens and refresh cookies. A client-side global response interceptor watches for 401 status codes to handle stale sessions.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend
    participant BE as Express API Gateway
    participant DB as MongoDB
    
    User->>FE: Open Login Page & Enter Credentials
    FE->>FE: Validate Input Format (Client-Side)
    
    alt Validation Fails
        FE-->>User: Show Error (e.g., Invalid Email Format)
    else Validation Passes
        FE->>BE: POST /api/v1/auth/login
        BE->>BE: Zod Schema Validation
        alt Validation Fails
            BE-->>FE: Return 400/422 Validation Error
            FE-->>User: Display Error Message
        else Validation Passes
            BE->>DB: Query User (by Email)
            DB-->>BE: Return User Document (bcrypt hash)
            BE->>BE: Compare Password (bcrypt.compare)
            alt Credentials Invalid
                BE-->>FE: Return 401 (AUTH_001 - Invalid Credentials)
                FE-->>User: Display "Invalid credentials"
            else Credentials Valid
                BE->>BE: Generate JWT Access Token (Short-lived)
                BE->>BE: Generate Refresh Token
                BE-->>FE: Return 200 OK + Access Token
                FE->>FE: Store Access Token in Local Storage & Context
                FE->>FE: Redirect to Dashboard
                FE-->>User: Render Dashboard / Profile
            end
        end
    end
```

---

## 4. Recommendation Flow & Pipeline
AutoMatch Pro utilizes a rule-based recommendation strategy. Business rules score and filter candidate vehicles from the database to rank and extract explanations.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    
    User->>FE: Submit Preference Form (Budget, Family Size, Driving Habits, etc.)
    FE->>FE: Client-side validation
    FE->>BE: POST /api/v1/recommendations
    BE->>BE: Zod Validation & Request Sanitization
    BE->>BE: Apply Weighted Business Scoring rules (Budget, Safety, Mileage)
    BE->>DB: Fetch Candidate Cars matching basic parameters
    DB-->>BE: Return matching Candidate Car list
    BE->>BE: Filter & Score Candidates (Rank top matching cars)
    BE->>BE: Rule-Based Explanations Builder (Hydrates specifications & trade-offs)
    BE->>DB: Log recommendation history for session
    DB-->>BE: Acknowledge log
    BE-->>FE: Return 200 OK + Structured Recommendation JSON
    FE->>FE: Cache response
    FE->>FE: Render Recommendation Cards (Trade-offs & reasons)
    FE-->>User: Display Recommendations
```

### Recommendation Input Variables:
- **Budget**: Maximum purchase price constraint.
- **Family size**: Determines seating capacity.
- **Usage & Daily distance**: Calibrates mileage and fuel preference weights.
- **Fuel preference**: Petrol, Diesel, Electric, or Hybrid.
- **Transmission**: Manual or Automatic.
- **Safety priority**: NCAP rating weights.
- **Mileage priority**: Fuel economy weight.
- **Brand preference (optional)**: Direct filter or score boost.

### Business Scoring Logic & Numerical Weights (Max 100 Points):

1. **Price Match (Max 35 Points)**:
   - If the car's price is within budget:
     - If the price-to-budget ratio is `>= 0.6` (i.e. close to the target budget indicating a segment fit): **35 Points**
     - Otherwise, the score scales down linearly: `15 + Math.round(20 * (ratio / 0.6))` Points (guaranteeing at least **15 Points**).
   - If the car's price exceeds the budget but is within `1.2 * budget` (buffer limit):
     - The score scales down linearly based on excess: `20 - Math.round(15 * excessRatio)` Points.
   - If the car's price exceeds `1.2 * budget`: **0 Points**.

2. **Seating Capacity Match (Max 20 Points)**:
   - If the vehicle's seating capacity exactly equals the family size: **20 Points**.
   - If the vehicle's capacity exceeds the family size (extra space): **15 Points**.
   - If the vehicle's capacity is lower than the family size: **0 Points** (does not fit).

3. **Priority Match (Max 25 Points)**:
   - Based on the user's primary concern (`Safety`, `Mileage`, `Budget`, or `Performance`):
     - **Safety**: 5-star NCAP = **25 Points**, 4-star = **18 Points**, 3-star = **10 Points**, lower = **3 Points**.
     - **Mileage**: `>= 22 km/l` = **25 Points**, `>= 18 km/l` = **20 Points**, `>= 15 km/l` = **12 Points**, lower = **5 Points**.
     - **Budget**: Price `<= 70%` of budget = **25 Points**, `<= 90%` = **20 Points**, `<= 100%` = **15 Points**, higher = **5 Points**.
     - **Performance**: Electric/EV powertrains OR displacement `> 1600cc` OR Turbocharged (Turbo/TSI) engine = **25 Points**; standard displacement `>= 1200cc` = **18 Points**; lower displacement = **8 Points**.

4. **Fuel & Transmission Preference (Max 10 Points)**:
   - **Fuel Type**: Matches preferred fuel type or preference is set to `Any`: **5 Points** (otherwise 0).
   - **Transmission**: Matches preferred transmission or preference is set to `Any`: **5 Points** (otherwise 0).

5. **Brand Preference (Max 10 Points)**:
   - Matches the user's optional preferred car manufacturer (make): **10 Points** (otherwise 0).

---

## 5. Search & Discovery Flow
Standard database search integrates keyword lookups, structured filtering, and server-side pagination utilizing indexing for rapid response times.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    
    User->>FE: Input search query / select filters (Make, Price, Fuel, etc.)
    FE->>FE: Debounce keystrokes (if typing search input)
    FE->>BE: GET /api/v1/cars?page=1&limit=10&brand=...&minPrice=...
    BE->>BE: Validate query parameters
    BE->>DB: Query cars with projection & pagination (Indexed fields: make, model, price, bodyType)
    DB-->>BE: Return page records & total matches count
    BE-->>FE: Return 200 OK with Paginated Schema (page, limit, total, hasNext, data)
    FE->>FE: Cache result
    FE->>FE: Render Car Grid & Pagination components
    FE-->>User: Update search results page
```

---

## 6. Car Comparison Flow
Allows users to compare up to 4 selected cars side-by-side, highlighting the differences and best values across core categories.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    
    User->>FE: Select cars for comparison (maximum 4)
    User->>FE: Click Compare button
    FE->>FE: Check Limit Constraint (<= 4)
    FE->>BE: GET /api/v1/cars/compare?ids=id1,id2,id3
    BE->>BE: Validate Comparison Request
    BE->>DB: Fetch details for specified Car IDs
    DB-->>BE: Return Car documents
    BE->>BE: Align specifications & compute differences / best value indicators
    BE-->>FE: Return Comparison Dataset
    FE->>FE: Render Side-by-Side Comparison Table
    FE-->>User: Display Comparison Table
```

---

## 7. Wishlist Flow
Wishlist management is a protected workflow requiring JWT authentication. Changes are persisted directly to the User database record.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as MongoDB
    
    User->>FE: Click "Add to Wishlist" or "Remove from Wishlist"
    FE->>FE: Check User authentication state
    alt User Not Authenticated
        FE->>FE: Redirect to Login (/login)
    else User Authenticated
        FE->>BE: POST /api/v1/wishlist (with JWT in headers & carId in body)
        BE->>BE: JWT Authentication middleware verifies token
        BE->>BE: Wishlist Service processes Request
        BE->>DB: Update User Wishlist Array (users.wishlist)
        DB-->>BE: Acknowledge update & return updated array
        BE-->>FE: Return 200 OK + Updated Wishlist references
        FE->>FE: Dispatch action (update local wishlist store)
        FE->>FE: Refresh UI state (update Wishlist indicator icon)
        FE-->>User: Visual confirmation (heart active/inactive)
    end
```

---

## 8. Refresh Token Flow
To maintain session security without sacrificing user experience, access tokens are transparently verified. If the token becomes stale or invalid (e.g. database reset), a global Axios interceptor intercepts the 401 error, purges user/auth state from context and local storage, and prompts the login modal.

```mermaid
sequenceDiagram
    autonumber
    participant FE as React Frontend
    participant AX as Axios Client Interceptor
    participant BE as Express Backend
    
    FE->>AX: Call protected API (e.g., GET /api/v1/wishlist)
    AX->>BE: Forward request with Bearer JWT (Expired Access Token)
    BE->>BE: Verify JWT (Token expired check)
    BE-->>AX: Return 401 Unauthorized
    
    Note over AX,BE: Interceptor catches 401 error, purges stale state, prompts login
    AX->>FE: Reset Auth Context & Local Storage
    FE-->>User: Display Login Modal Interface
```

---

## 9. Error Handling Flow
The backend error handling middleware isolates user-facing standard errors from internal exceptions, preventing server details and stack traces from leaking to the client.

```mermaid
graph TD
    Req[Incoming API Request] --> Val{Validation Passes?}
    
    %% Validation Failure Path
    Val -- No --> ValErr[Centralized Error Middleware]
    ValErr --> Send400[Send 400/422 JSON Response <br> containing VAL_xxx errors]
    
    %% Business Logic Execution
    Val -- Yes --> Business[Execute Business Logic]
    
    Business -- Throws Exception --> Exception[Exception Thrown]
    Exception --> ErrMid[Centralized Exception Handler]
    ErrMid --> LogErr[Log using Winston with traceId <br> Never log passwords/tokens/secrets]
    LogErr --> Send500[Send 500 JSON Response + traceId <br> and generic message SYS_001]
    
    Business -- Success --> Send200[Send 200 Success JSON Response]
```

### Standardized Error Format:
```json
{
  "success": false,
  "code": "AUTH_001",
  "message": "Invalid credentials.",
  "errors": [],
  "traceId": "req_123456789"
}
```

---

## 10. Git Workflow & CI/CD Pipeline
Continuous Integration and Deployment automated checks guarantee that no breaking changes, syntax failures, or credentials reach production.

```mermaid
graph TD
    Dev[Developer commits change] --> Branch[Create Feature Branch: feature/* or bugfix/*]
    Branch --> Push[Git Push to Remote Repository]
    Push --> PR[Create Pull Request to develop/main branch]
    PR --> CI[GitHub Actions Pipeline Triggers]
    
    %% CI Steps
    CI --> Install[1. Install Dependencies]
    Install --> Lint[2. Run ESLint Code Audit]
    Lint --> TypeCheck[3. TypeScript Compile Check]
    TypeCheck --> Unit[4. Run Unit Tests via Mocha]
    Unit --> Integration[5. Run Integration Tests via Supertest]
    Integration --> Audit[6. Dependency Audit npm audit]
    Audit --> BuildCheck[7. Build Production App]
    
    BuildCheck --> CodeReview[8. Code Review and Approval]
    CodeReview --> Merge[Merge PR into target branch]
    
    %% CD Deploy Steps
    Merge --> Deploy[CD Deployment Pipeline]
    Deploy --> Railway[Deploy App to Railway]
    Deploy --> HealthCheck[Verify Health Endpoint GET /health]
    HealthCheck --> Production([Application Online & Verified])
```

---
*AutoMatch Pro Enterprise Flows Documentation Suite (v1.0.0)*
