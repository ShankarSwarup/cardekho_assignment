import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { CarRepository } from '../repositories/CarRepository.js';

describe('Cars API Endpoint Tests (Mocked DB)', () => {
  const mockCar = {
    _id: '507f1f77bcf86cd799439011',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'LXI AMT',
    year: 2023,
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '1197 cc',
    mileage: 22.38,
    safetyRating: 3,
    seatingCapacity: 5,
    price: 649000,
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80']
  };

  const mockSUV = {
    _id: '507f1f77bcf86cd799439012',
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Sigma 4',
    year: 2024,
    bodyType: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engine: '2755 cc',
    mileage: 14.4,
    safetyRating: 5,
    seatingCapacity: 7,
    price: 3843000,
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80']
  };

  before(() => {
    CarRepository.prototype.findWithPagination = async function(filters) {
      if (filters.performance === 'Eco') {
        return { cars: [mockCar], total: 1 };
      }
      if (filters.performance === 'High') {
        return { cars: [mockSUV], total: 1 };
      }
      if (filters.model === 'Swift') {
        return { cars: [mockCar], total: 1 };
      }
      return { cars: [mockCar, mockSUV], total: 2 };
    };

    CarRepository.prototype.getDistinctFilters = async function() {
      return {
        brands: ['Maruti Suzuki', 'Toyota'],
        models: ['Swift', 'Fortuner'],
        brandModels: {
          'Maruti Suzuki': ['Swift'],
          'Toyota': ['Fortuner']
        },
        fuelTypes: ['Petrol', 'Diesel'],
        transmissions: ['Automatic', 'Manual'],
        bodyTypes: ['Hatchback', 'SUV'],
        seatingCapacities: [5, 7],
        safetyRatings: [3, 5],
        years: [2023, 2024]
      };
    };

    CarRepository.prototype.searchCars = async function(keyword) {
      if (keyword && keyword.toLowerCase().includes('swift')) {
        return [mockCar];
      }
      return [mockCar, mockSUV];
    };

    CarRepository.prototype.findByIds = async function(ids) {
      const list = [mockCar, mockSUV];
      return list.filter(c => ids.includes(c._id));
    };

    CarRepository.prototype.findById = async function(id) {
      if (id === mockCar._id) return mockCar as any;
      if (id === mockSUV._id) return mockSUV as any;
      return null;
    };
  });

  it('should fetch paginated catalog list', async () => {
    const res = await request(app).get('/api/v1/cars?page=1&limit=2');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.cars).to.be.an('array');
  });

  it('should retrieve distinct vehicle filter criteria', async () => {
    const res = await request(app).get('/api/v1/cars/filters');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.brands).to.include('Toyota');
  });

  it('should filter cars by performance type Eco (< 1200cc)', async () => {
    const res = await request(app).get('/api/v1/cars?performance=Eco');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.cars[0].model).to.equal('Swift');
  });

  it('should filter cars by performance type High (> 1600cc)', async () => {
    const res = await request(app).get('/api/v1/cars?performance=High');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.cars[0].model).to.equal('Fortuner');
  });

  it('should search cars by brand keyword', async () => {
    const res = await request(app).get('/api/v1/cars/search?keyword=Swift');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data[0].model).to.equal('Swift');
  });

  it('should filter cars by specific model (e.g. Swift)', async () => {
    const res = await request(app).get('/api/v1/cars?model=Swift');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.cars[0].model).to.equal('Swift');
  });

  it('should compare specifications of selected cars', async () => {
    const res = await request(app).get(`/api/v1/cars/compare?ids=${mockCar._id},${mockSUV._id}`);
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.comparisonTable).to.be.an('array');
  });
});
