import axios from 'axios';

const runTest = async () => {
  try {
    console.log('1. Attempting login to obtain JWT access token...');
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'john@example.com',
      password: 'Password@123'
    });

    const token = loginRes.data.data.accessToken;
    if (!token) {
      throw new Error('No access token returned in login response.');
    }
    console.log('Login successful. Token acquired.');

    const dummyPreferences = {
      budget: 1500000,
      familySize: 5,
      fuel: 'Petrol',
      transmission: 'Automatic',
      dailyDistance: 40,
      priority: 'Safety'
    };

    console.log('2. Making authenticated POST request to /api/v1/recommendations...');
    const recRes = await axios.post(
      'http://localhost:5000/api/v1/recommendations',
      dummyPreferences,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 40000 // Give Gemini plenty of time
      }
    );

    console.log('\n--- SUCCESS: EXPRESS API ENDPOINT RESPONSE ---');
    console.log('Status Code:', recRes.status);
    console.log('Success:', recRes.data.success);
    console.log('Explanation:', recRes.data.data.explanation);
    console.log('Recommendations count:', recRes.data.data.recommendations?.length);
    console.log('----------------------------------------------\n');
    process.exit(0);
  } catch (error: any) {
    console.error('API endpoint test failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTest();
