# Backend Architecture & API Documentation

This document explains the architecture of the Node.js + Express backend server, detailing the layered flow of control, database schemas, and a complete catalog of all API endpoints defined in each route file.

---

## 1. Backend Layered Architecture

The server utilizes a structured, layered design to separate concerns and ensure maintainability:

```
                  +--------------------------------+
                  |      Incoming HTTP Request     |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |         Express Router         |
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |     Middleware Pipeline        | (TraceID, Helmet, CORS, JWT Auth)
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |    Zod Validation Middleware   | (Format & range checks)
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |           Controller           | (HTTP parsing & formats responses)
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |            Service             | (Core business & logical flow rules)
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |           Repository           | (Mongoose direct DB queries)
                  +--------------------------------+
                                  |
                                  v
                  +--------------------------------+
                  |       MongoDB Database         |
                  +--------------------------------+
```

1. **Router Layer (`src/routes/`)**: Receives the raw HTTP request and maps it to the appropriate controller method.
2. **Middleware Layer (`src/middlewares/`)**: Intercepts requests to perform cross-cutting tasks (logging requests, secure CORS policy checking, validating token signatures).
3. **Validator Layer (`src/validators/`)**: Uses **Zod** to validate request parameter types, body payloads, and query parameters before invoking business logic.
4. **Controller Layer (`src/controllers/`)**: Extracts route values, handles async try/catch blocks, and formats the standard JSON response envelopes.
5. **Service Layer (`src/services/`)**: Implements application-specific rules, handles encryption operations, and calculates pagination metadata.
6. **Repository Layer (`src/repositories/`)**: Abstracts Mongoose operations, building query pipelines and executing MongoDB filters.

---

## 2. API Endpoints Catalog (File-by-File Breakdown)

All routes are mounted under the base path `/api/v1/`.

### A. Authentication Routes (`src/routes/authRoutes.ts`)
Handles user signup, login operations, and credential verifications.

#### 1. `POST /auth/register`
- **Description**: Registers a new user account.
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Validation Rules**:
  - `fullName`: String (minimum 2 characters).
  - `email`: Must follow a valid email string format.
  - `password`: String (minimum 8 characters).
- **Core Operations**:
  - Checks if the email is already registered in the User collection.
  - Encrypts password using standard bcrypt.
  - Generates a JWT access token for automatic session logging.
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "607f1f77bcf86cd799439099",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "accessToken": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### 2. `POST /auth/login`
- **Description**: Authenticates user logins and issues JWT session access tokens.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Validation Rules**:
  - `email`: Must be a valid email format.
  - `password`: Password is required.
- **Core Operations**:
  - Queries the User collection by email.
  - Compares the provided password hash against the stored database value.
  - Generates and returns a signed JWT access token.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "607f1f77bcf86cd799439099",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "accessToken": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

---

### B. Car Catalog Routes (`src/routes/carRoutes.ts`)
Manages vehicle catalog querying, specification aggregations, comparison tables, and wishlists.

#### 1. `GET /cars`
- **Description**: Retrieves a paginated list of catalog cars matching custom sidebar filters.
- **Query Parameters**:
  - `page` (default `1`): The target page index.
  - `limit` (default `6`): Vehicles count per page.
  - `brand`: Filter cars by make (e.g., Tata, Honda).
  - `model`: Filter cars by model name (dependent on brand).
  - `fuel`: Filter by fuel type (Petrol, Diesel, CNG, Electric).
  - `transmission`: Filter by transmission (Manual, Automatic, AMT).
  - `minPrice` / `maxPrice`: Filter by price range.
  - `safetyRating` (1-5): Filter by minimum NCAP safety star rating.
  - `seatingCapacity`: Filter by seating capacity (5, 7).
  - `minYear` / `maxYear`: Filter by model year range.
  - `minMileage`: Filter by minimum mileage cutoff.
  - `performance` (Eco, Medium, High): Categorized engine displacement rules.
  - `keyword`: Text keyword search matching variant, make, or model.
  - `sortBy` (price, safetyRating, mileage): Sort criteria.
  - `sortOrder` (asc, desc): Sort direction.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Vehicles retrieved successfully",
    "data": {
      "cars": [ ... ],
      "pagination": {
        "page": 1,
        "limit": 6,
        "total": 45,
        "hasNext": true
      }
    }
  }
  ```

#### 2. `GET /cars/filters`
- **Description**: Returns all distinct criteria lists present in the database to populate the sidebar dropdown filters.
- **Core Operations**:
  - Fetches distinct makes, models, fuels, transmissions, seating, safety ratings, and years.
  - Executes a MongoDB `$group` aggregation to pair available models under each brand.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Filters fetched successfully",
    "data": {
      "brands": ["Hyundai", "Tata", "Toyota"],
      "models": ["Fortuner", "Nexon", "i20"],
      "brandModels": {
        "Toyota": ["Fortuner"],
        "Tata": ["Nexon"],
        "Hyundai": ["i20"]
      },
      "fuelTypes": ["Petrol", "Diesel", "Electric"],
      "transmissions": ["Automatic", "Manual"],
      "seatingCapacities": [5, 7],
      "safetyRatings": [3, 4, 5],
      "years": [2023, 2024]
    }
  }
  ```

#### 3. `GET /cars/compare`
- **Description**: Aligns specifications for up to 4 selected cars.
- **Query Parameters**:
  - `ids`: Comma-separated list of up to 4 MongoDB ObjectIds (e.g., `?ids=id1,id2`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Comparison retrieved",
    "data": {
      "comparisonTable": [
        { "label": "Model Name", "values": ["Swift", "Fortuner"] },
        { "label": "NCAP Safety", "values": ["3 Star", "5 Star"] }
      ]
    }
  }
  ```

#### 4. `GET /cars/wishlist`
- **Description**: Retrieves all wishlisted cars saved in the logged-in user's profile.
- **Headers**:
  - `Authorization: Bearer <JWT>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "607f1f77bcf86cd799439011",
        "make": "Maruti Suzuki",
        "model": "Swift",
        "price": 649000
      }
    ]
  }
  ```

#### 5. `POST /cars/wishlist`
- **Description**: Adds or removes a vehicle from the authenticated user's wishlist.
- **Headers**:
  - `Authorization: Bearer <JWT>`
- **Request Body**:
  ```json
  {
    "carId": "607f1f77bcf86cd799439011",
    "action": "add" // or "remove"
  }
  ```
- **Success Response (`200 OK`)**: Returns the updated User document:
  ```json
  {
    "success": true,
    "message": "Wishlist updated successfully",
    "data": {
      "_id": "607f1f77bcf86cd799439099",
      "fullName": "Jane Doe",
      "wishlist": ["607f1f77bcf86cd799439011"]
    }
  }
  ```

#### 6. `GET /cars/:id`
- **Description**: Returns the full specifications profile of a single car.
- **Parameters**:
  - `id`: The MongoDB ObjectId of the car.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "607f1f77bcf86cd799439011",
      "make": "Maruti Suzuki",
      "model": "Swift",
      "variant": "LXI",
      "price": 649000,
      "images": [...]
    }
  }
  ```

---

### C. Reviews & Feedback Routes (`src/routes/reviewRoutes.ts`)
Manages vehicle reviews creation, listing, and deletion.

#### 1. `POST /cars/:id/reviews`
- **Description**: Submits a customer rating and commentary review for a specific car.
- **Headers**:
  - `Authorization: Bearer <JWT>`
- **Parameters**:
  - `id`: Car ObjectId.
- **Request Body**:
  ```json
  {
    "rating": 5,
    "review": "Fantastic value for money, highly recommended!"
  }
  ```
- **Validation Rules**:
  - `rating`: Integer between 1 and 5.
  - `review`: String (minimum 5 characters).
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Review submitted successfully",
    "data": {
      "_id": "607f1f77bcf86cd799439077",
      "carId": "607f1f77bcf86cd799439011",
      "userId": "607f1f77bcf86cd799439099",
      "rating": 5,
      "review": "Fantastic value for money, highly recommended!"
    }
  }
  ```

#### 2. `GET /cars/:id/reviews`
- **Description**: Retrieves all user reviews submitted for a specific vehicle.
- **Parameters**:
  - `id`: Car ObjectId.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "607f1f77bcf86cd799439077",
        "rating": 5,
        "review": "Fantastic value for money, highly recommended!",
        "createdAt": "2026-07-01T18:46:12Z",
        "userId": {
          "fullName": "Jane Doe"
        }
      }
    ]
  }
  ```

#### 3. `DELETE /reviews/:id`
- **Description**: Deletes a customer review.
- **Headers**:
  - `Authorization: Bearer <JWT>`
- **Parameters**:
  - `id`: Review ObjectId.
- **Validation Rules**:
  - The request token's `userId` must match the `userId` stored on the review document (author check).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Review deleted successfully"
  }
  ```

---

## 3. MongoDB Mongoose Schemas & Indexes

The application structures three closely related MongoDB collections using Mongoose schemas:

### A. Car Collection (`CarModel`)
Designed to store vehicle parameters, price metrics, performance statistics, and media arrays.
- **Schema Fields**:
  - `make` (`String`, Indexed): Brand manufacturer (e.g., *Tata*, *Toyota*).
  - `model` (`String`, Indexed): Specific name of the vehicle (e.g., *Nexon*, *Fortuner*).
  - `variant` (`String`): Sub-model details (e.g., *LXI AMT*, *Sigma 4*).
  - `year` (`Number`): Model manufacturing year.
  - `bodyType` (`String`, Indexed): Classification (e.g., *Hatchback*, *SUV*).
  - `fuelType` (`String`, Indexed): Engine fuels (e.g., *Petrol*, *Diesel*, *CNG*, *Electric*).
  - `transmission` (`String`): Gearbox style (e.g., *Manual*, *Automatic*, *AMT*).
  - `engine` (`String`): Displacement details (e.g., *1197 cc*, *PMS Motor*).
  - `mileage` (`Number`): Fuel efficiency metrics (km/l).
  - `safetyRating` (`Number`): Global NCAP safety index stars count.
  - `seatingCapacity` (`Number`): Passenger count (e.g., *5*, *7*).
  - `price` (`Number`, Indexed): Price in INR.
  - `images` (`[String]`): Carousel visual links array.
- **Indexes**:
  - Compound Index on `{ make: 1, model: 1 }` to accelerate brand/model queries.
  - Individual indexes on `make`, `model`, `bodyType`, `fuelType`, and `price` to maximize search speeds.

---

### B. User Collection (`UserModel`)
Saves profiles, user credentials, session security metrics, and wishlist listings.
- **Schema Fields**:
  - `fullName` (`String`): User's legal name.
  - `email` (`String`, Indexed, Unique): User's email (normalized to lowercase).
  - `password` (`String`): Bcrypt salted password hash.
  - `role` (`String`): Security scopes (defaults to `'user'`, supports `'admin'`).
  - `wishlist` (`[Schema.Types.ObjectId]`, Ref `'Car'`): Array referencing matching vehicle ObjectIds in the Car collection.
- **Middleware Hooks**:
  - **`pre('save')`**: Evaluated before saving document changes. If the `password` field is modified, it generates an active salt (factor 12) and hashes the cleartext password using `bcryptjs` before committing it to MongoDB.

---

### C. Review Collection (`ReviewModel`)
Saves ratings and customer commentary text for vehicles.
- **Schema Fields**:
  - `userId` (`Schema.Types.ObjectId`, Ref `'User'`, Indexed): ObjectId of the reviewer.
  - `carId` (`Schema.Types.ObjectId`, Ref `'Car'`, Indexed): ObjectId of the vehicle.
  - `rating` (`Number`, Min: 1, Max: 5): Rating points score.
  - `review` (`String`, MaxLength: 1000): Customer commentary context.
- **Data Relations**:
  - Joins user details via the `userId` ref pointer to display reviewer names dynamically.

