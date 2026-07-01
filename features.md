# Features & Application Flows

This document details the active features, validation rules, edge cases handled, and visual workflows implemented in the **AutoMatch Pro** platform.

---

## 1. Active Features Explanations

### A. Advanced Catalog Filtering & Keyword Search
To help buyers narrow down their selections, the catalog search is equipped with an advanced filters sidebar:
- **Brand (Make)**: Dynamically loaded brands dropdown options queried from distinct database values.
- **Model**: A dynamic models selector dropdown that is disabled by default. Once a user selects a Brand, the dropdown becomes active and is populated with *only* models belonging to that selected brand in the database collection (e.g., selecting 'Maruti Suzuki' shows 'Swift', while selecting 'Toyota' shows 'Fortuner'). This prevents users from selecting brand-model pairs that do not exist.
- **Fuel Type**: Quick selection tabs matching database fuel segments (Petrol, Diesel, CNG, Electric).
- **Transmission**: Filter options matching AMT, Manual, and Automatic transmissions.
- **Safety Rating**: Min NCAP Star threshold filter (3★+, 4★+, 5★).
- **Seating Capacity**: Filter vehicles based on passenger capacity (5 Seats vs 7 Seats).
- **Model Year Range**: Minimum and maximum year bounds selectors.
- **Mileage Slider**: Minimum mileage cutoff range slider (10 to 25 km/l).
- **Engine Performance**: Segmented displacement categorizer:
  - `Eco (<1.2L)` matches engines $< 1200cc$ and EV motors.
  - `Standard (1.2-1.6L)` matches mid-range engines.
  - `Sports (>1.6L)` matches engines $> 1600cc$.
- **Price Bounds**: Min and Max bounds fields (validated to prevent logical errors).

### B. Specifications Comparison Grid
- Enables side-by-side spec comparison for up to 4 selected vehicles.
- Gathers key specs (price, transmission, fuel, body type, engine CC, mileage, safety rating, seating) into a neat grid to assist users in finalizing their shortlists.

### C. Persistent Profile Wishlist
- Toggles items directly into the user profile database, replacing volatile client-side local storage.
- Wishlist cards display a solid indigo highlight indicator ("Selected") if they are currently added to the specifications comparison.

### D. Reviews & Feedback
- Logged-in users can write and delete comments with 1-5 star ratings for each car, which are instantly saved to the database.

### E. Custom Toast Alerts System
- A zero-dependency CSS animated slide-in popup notifications overlay informing users of login/signup successes, validation errors, and wishlist/comparison status updates.

---

## 2. Validation Rules & Handled Edge Cases

### A. Image Carousel Reset
- **Edge Case**: If a user views a car with 3 images, clicks to image index `2`, and then opens another car with only 1 image, the carousel crashes (out-of-bounds error).
- **Handling**: Added a reactive `useEffect` monitoring `selectedCar._id` that resets `currentImgIdx` to `0` whenever a new vehicle is selected.

### B. Price Bounds sanity checks
- **Edge Case**: Negative prices, or min price exceeding max price.
- **Handling**: Added state validation that outputs a warning message and disables filter submission.

### C. Zod Boundary checks
- **Edge Case**: Review ratings must be between 1 and 5 stars.
- **Handling**: Strict validation schemas in the backend using Zod (`z.number().min(1).max(5)`). Any invalid values trigger a structured `422 Unprocessable Entity` response, displayed as a Toast alert in the client.

### D. Initial Mount Race Conditions
- **Edge Case**: Token initialization delay on startup caused immediate page mounts to dispatch unauthenticated requests (resulting in 401 errors).
- **Handling**: Replaced implicit bearer tokens with explicit authorization header injection inside the data fetching callback functions.

---

## 3. Visual System Flow Diagrams

### A. Overall System Flow
The overall user journey from landing on the application to final shortlist comparison.

```mermaid
flowchart TD
    User([User]) --> LP[Landing Page]
    
    LP --> Search[Search & Filter Cars]
    LP --> Browse[Browse Catalog List]
    
    Search --> ApplyFilters[Apply Sidebar Filters]
    Browse --> ApplyFilters
    
    ApplyFilters --> DisplayCars[Display Paginated Catalog Results]
    
    DisplayCars --> Compare[Add to Compare List]
    DisplayCars --> Details[Open Details & Reviews Modal]
    
    Compare --> ViewGrid[View Specs Comparison Grid]
    Details --> Wishlist[Save to Profile Wishlist]
    ViewGrid --> Wishlist
```

---

### B. Authentication & Signup Flow
Handles registration, login, JWT storage inside client local storage, and auto-login on mounting.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser Client
    participant FE as React Frontend (AuthContext)
    participant BE as Express API Server
    participant DB as MongoDB Database

    %% Sign Up Flow
    User->>FE: Click Signup & Enter Details
    FE->>BE: POST /api/v1/auth/register (fullName, email, password)
    BE->>BE: Zod Format Validation
    BE->>DB: Check email duplicate & Save User
    DB-->>BE: User Document saved
    BE-->>FE: Return User Object & JWT Token
    FE->>FE: Save JWT + User info to localStorage
    FE-->>User: Auto-Login Success Toast Alert

    %% Mount / Reload Flow
    Note over User,DB: App Reload / Initial Mount
    FE->>FE: Read JWT + User from localStorage
    FE->>FE: Restore Session & Sync headers
    FE-->>User: Session restored automatically
```

---

### C. Search & Catalog Query Flow
Detailed data propagation from catalog filter controls down to the MongoDB repository layer.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser Client
    participant FE as React Frontend (CarContext)
    participant BE as Express API Router
    participant RE as CarRepository (Server)
    participant DB as MongoDB Database

    User->>FE: Toggle filters (Safety, Seating, Mileage, Year range)
    User->>FE: Click "Apply Filters" or "Find"
    FE->>FE: Validate price bounds & update applied states
    FE->>BE: GET /api/v1/cars?page=1&limit=6&safetyRating=X&seatingCapacity=Y&minYear=A&maxYear=B&minMileage=C
    BE->>BE: Zod parse query parameters
    BE->>RE: Call findWithPagination(filters, page, limit)
    RE->>RE: Compile query object (regex brand, safetyRating $gte, mileage $gte, year ranges)
    RE->>DB: Query collections with limit, skip and sort
    DB-->>RE: Return vehicles list & total match count
    RE-->>BE: Return combined pagination object
    BE-->>FE: Return JSON status response
    FE-->>User: Render catalog grid & sticky pagination controls
```

---

### D. Specifications Comparison Flow
Workflow for comparison list updates and spec grid fetching.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend (CarContext)
    participant BE as Express API Server
    participant DB as MongoDB Database

    User->>FE: Click "Compare" button on card
    alt Comparison List size >= 4
        FE-->>User: Throw error: Max comparison limit is 4
    else List size < 4
        FE->>FE: Add vehicle to selectedForCompare array
        FE-->>User: Show Toast: Car added to compare list
    end
    
    User->>FE: Click "Compare Specs" tab
    FE->>BE: GET /api/v1/cars/compare?ids=ID1,ID2,ID3
    BE->>DB: Find cars matching IDs
    DB-->>BE: Return matching vehicles data
    BE-->>FE: Return aligned spec comparison grid object
    FE-->>User: Render specs comparison table
```

---

### E. Profile Wishlist Flow
Handles secure, authorized wishlist addition and database sync.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant FE as React Frontend (CarContext)
    participant BE as Express API Server
    participant DB as MongoDB Database

    User->>FE: Click "Heart" (Wishlist Toggle)
    alt User is not logged in
        FE->>FE: Open LoginModal dialog
        FE-->>User: Prompt: Please sign in to wishlist cars
    else User is logged in
        FE->>BE: POST /api/v1/cars/wishlist (carId, action: add/remove) with Bearer JWT
        BE->>BE: Verify JWT Token Signature
        BE->>DB: Push/Pull Car ObjectId in user.wishlist
        DB-->>BE: Updated User profile returned
        BE-->>FE: Success response (Updated User Object)
        FE->>FE: Fetch wishlist details from GET /cars/wishlist
        FE-->>User: Show Toast: Saved to / Removed from wishlist
    end
```

---

### F. Reviews Submission Flow
Validates ratings bounds and updates customer commentary records.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as React Frontend (CarContext)
    participant BE as Express API Controller
    participant DB as MongoDB Database

    User->>FE: Select Rating (1-5 stars) & Type review text
    User->>FE: Click "Submit Review"
    alt Review length < 5 characters
        FE-->>User: Alert: Review must be at least 5 characters
    else Validation passes
        FE->>BE: POST /api/v1/cars/carId/reviews (rating, review) with JWT
        BE->>BE: Validate JWT and Zod schema bounds
        alt Rating not in 1-5 range
            BE-->>FE: Return 422 Unprocessable Entity
            FE-->>User: Show Toast: Rating validation failed
        else Validation Success
            BE->>DB: Create review document mapping userId + carId
            DB-->>BE: Review document created
            BE-->>FE: Return 201 Success status
            FE->>FE: Reload car reviews list from server
            FE-->>User: Show Toast: Review submitted successfully
        end
    end
```
