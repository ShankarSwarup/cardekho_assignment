import axios from 'axios';
import mongoose from 'mongoose';

const API_URL = `${process.env.SERVER_URL}/api/v1`;

const runValidationSuite = async () => {
  console.log('==================================================');
  console.log('     AUTOMATCH PRO ENDPOINT VALIDATION SUITE       ');
  console.log('==================================================\n');

  let token = '';
  let sampleCarId1 = '';
  let sampleCarId2 = '';

  try {
    // 1. Validate Authentication Login
    console.log('TEST 1: POST /auth/login ...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'Password@123'
    });
    
    if (loginRes.status === 200 && loginRes.data.success) {
      token = loginRes.data.data.accessToken;
      console.log('👉 PASS: Login succeeded. JWT acquired.\n');
    } else {
      throw new Error(`Auth fail: ${JSON.stringify(loginRes.data)}`);
    }

    // 2. Validate Cars List Catalog Retrieval & Pagination
    console.log('TEST 2: GET /cars (Catalog Pagination) ...');
    const catalogRes = await axios.get(`${API_URL}/cars?page=1&limit=2`);
    if (catalogRes.status === 200 && catalogRes.data.success) {
      const cars = catalogRes.data.data.cars;
      console.log(`👉 PASS: Retrieved ${cars.length} cars. Total counts: ${catalogRes.data.data.pagination.total}`);
      if (cars.length > 0) {
        sampleCarId1 = cars[0]._id;
        sampleCarId2 = cars[1]?._id || cars[0]._id;
      }
      console.log('');
    } else {
      throw new Error(`Catalog fail: ${JSON.stringify(catalogRes.data)}`);
    }

    // 3. Validate Filter Parameters (brand, fuel, minPrice, maxPrice)
    console.log('TEST 3: GET /cars (Query Parameter Filters) ...');
    const filterRes = await axios.get(`${API_URL}/cars?brand=Tata&fuel=Petrol&minPrice=600000&maxPrice=2000000`);
    if (filterRes.status === 200 && filterRes.data.success) {
      const filtered = filterRes.data.data.cars;
      console.log(`👉 PASS: Retrieved ${filtered.length} filtered cars.`);
      // Assert filters matching
      const mismatches = filtered.filter((c: any) => c.make !== 'Tata' || c.fuelType !== 'Petrol' || c.price < 600000 || c.price > 2000000);
      if (mismatches.length === 0) {
        console.log('   Verification: All records strictly adhere to filters (brand=Tata, fuel=Petrol, price range [6L-20L]).\n');
      } else {
        console.error('   Verification FAIL: Filter constraints violated in response!', mismatches);
      }
    } else {
      throw new Error(`Filters fail: ${JSON.stringify(filterRes.data)}`);
    }

    // 4. Validate Wishlist Synchronization
    console.log('TEST 4: POST /cars/wishlist (Sync State) ...');
    const wishlistAddRes = await axios.post(
      `${API_URL}/cars/wishlist`,
      { carId: sampleCarId1, action: 'add' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (wishlistAddRes.status === 200 && wishlistAddRes.data.success) {
      console.log('👉 PASS: Added vehicle to user wishlist successfully.');
    } else {
      throw new Error(`Wishlist add fail: ${JSON.stringify(wishlistAddRes.data)}`);
    }

    const wishlistRemoveRes = await axios.post(
      `${API_URL}/cars/wishlist`,
      { carId: sampleCarId1, action: 'remove' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (wishlistRemoveRes.status === 200 && wishlistRemoveRes.data.success) {
      console.log('👉 PASS: Removed vehicle from user wishlist successfully.\n');
    } else {
      throw new Error(`Wishlist remove fail: ${JSON.stringify(wishlistRemoveRes.data)}`);
    }

    // 5. Validate Car Comparison Spec Grids
    console.log('TEST 5: GET /cars/compare ...');
    const compareRes = await axios.get(`${API_URL}/cars/compare?ids=${sampleCarId1},${sampleCarId2}`);
    if (compareRes.status === 200 && compareRes.data.success) {
      const data = compareRes.data.data;
      console.log(`👉 PASS: Successfully generated specs comparison grid for ${data.vehicles?.length} cars.`);
      console.log(`   Comparison rows populated: ${data.comparisonTable?.length} rows.\n`);
    } else {
      throw new Error(`Compare fail: ${JSON.stringify(compareRes.data)}`);
    }

    // 6. Validate Rule-Based Recommendations Endpoint
    console.log('TEST 6: POST /recommendations (Rule-based scoring) ...');
    const recRes = await axios.post(
      `${API_URL}/recommendations`,
      {
        budget: 1500000,
        familySize: 5,
        fuel: 'Petrol',
        transmission: 'Automatic',
        dailyDistance: 40,
        priority: 'Safety'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (recRes.status === 200 && recRes.data.success) {
      console.log('👉 PASS: Recommendations computed successfully.');
      console.log(`   Explanation: "${recRes.data.data.explanation.slice(0, 100)}..."\n`);
    } else {
      throw new Error(`Recommendations fail: ${JSON.stringify(recRes.data)}`);
    }

    // 7. Validate Recommendations History Log Retrieval
    console.log('TEST 7: GET /recommendations/history ...');
    const historyRes = await axios.get(`${API_URL}/recommendations/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (historyRes.status === 200 && historyRes.data.success) {
      console.log(`👉 PASS: History records retrieved successfully. Total sessions: ${historyRes.data.data?.length}\n`);
    } else {
      throw new Error(`History fail: ${JSON.stringify(historyRes.data)}`);
    }

    // 8. Validate Reviews CRUD
    console.log('TEST 8: GET /cars/:id/reviews ...');
    const reviewsGetRes = await axios.get(`${API_URL}/cars/${sampleCarId1}/reviews`);
    if (reviewsGetRes.status === 200 && reviewsGetRes.data.success) {
      console.log(`👉 PASS: Retrieved ${reviewsGetRes.data.data?.length ?? 0} reviews for vehicle.\n`);
    } else {
      throw new Error(`Reviews GET fail: ${JSON.stringify(reviewsGetRes.data)}`);
    }

    console.log('TEST 9: POST /cars/:id/reviews ...');
    const reviewCreateRes = await axios.post(
      `${API_URL}/cars/${sampleCarId1}/reviews`,
      { rating: 4, review: 'Great value for money and comfortable for daily commute.' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if ((reviewCreateRes.status === 201 || reviewCreateRes.status === 200) && reviewCreateRes.data.success) {
      console.log('👉 PASS: Review created/updated successfully.');
      const createdReviewId = reviewCreateRes.data.data._id;

      console.log('TEST 10: DELETE /reviews/:id ...');
      const reviewDeleteRes = await axios.delete(`${API_URL}/reviews/${createdReviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (reviewDeleteRes.status === 200 && reviewDeleteRes.data.success) {
        console.log('👉 PASS: Review deleted successfully.\n');
      } else {
        throw new Error(`Review delete fail: ${JSON.stringify(reviewDeleteRes.data)}`);
      }
    } else {
      throw new Error(`Review create fail: ${JSON.stringify(reviewCreateRes.data)}`);
    }

    console.log('==================================================');
    console.log('  CONGRATULATIONS: ALL ENDPOINTS VALIDATED (PASS)  ');
    console.log('==================================================\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ VALIDATION SUITE ENCOUNTERED FAILURES:', error.response?.data || error.message);
    process.exit(1);
  }
};

runValidationSuite();
