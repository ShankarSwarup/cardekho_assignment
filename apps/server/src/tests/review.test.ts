import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { CarRepository } from '../repositories/CarRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { ReviewRepository } from '../repositories/ReviewRepository.js';
import { AuthService } from '../services/AuthService.js';

describe('Wishlist & Reviews API Endpoint Tests (Mocked DB)', () => {
  const mockCar = {
    _id: '507f1f77bcf86cd799439011',
    make: 'Tata',
    model: 'Nexon',
    variant: 'XM Manual',
    year: 2023,
    bodyType: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    engine: '1199 cc Turbo',
    mileage: 17.0,
    safetyRating: 5,
    seatingCapacity: 5,
    price: 815000,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80']
  };

  const mockUser = {
    _id: '507f1f77bcf86cd799439099',
    fullName: 'Test Reviewer',
    email: 'reviewer@example.com',
    wishlist: []
  };

  const mockReview = {
    _id: '507f1f77bcf86cd799439088',
    userId: '507f1f77bcf86cd799439099',
    carId: '507f1f77bcf86cd799439011',
    rating: 5,
    review: 'Excellent performance and build quality! Highly recommended.',
    createdAt: new Date().toISOString()
  };

  before(() => {
    // Stub auth verification
    AuthService.prototype.verifyAccessToken = function() {
      return { userId: '507f1f77bcf86cd799439099', role: 'user' };
    };

    CarRepository.prototype.findById = async function() {
      return mockCar as any;
    };

    UserRepository.prototype.addToWishlist = async function() {
      return {
        ...mockUser,
        wishlist: [mockCar._id]
      } as any;
    };

    UserRepository.prototype.removeFromWishlist = async function() {
      return mockUser as any;
    };

    UserRepository.prototype.findById = async function() {
      return {
        ...mockUser,
        wishlist: [mockCar]
      } as any;
    };

    ReviewRepository.prototype.findById = async function() {
      return mockReview as any;
    };

    ReviewRepository.prototype.findByUserAndCar = async function() {
      return null;
    };

    ReviewRepository.prototype.create = async function(reviewData) {
      return {
        _id: mockReview._id,
        userId: '507f1f77bcf86cd799439099',
        carId: reviewData.carId,
        rating: reviewData.rating,
        review: reviewData.review,
        createdAt: new Date().toISOString()
      } as any;
    };

    ReviewRepository.prototype.delete = async function(id) {
      return mockReview as any;
    };
  });

  it('should add a car to the user wishlist', async () => {
    const res = await request(app)
      .post('/api/v1/cars/wishlist')
      .set('Authorization', 'Bearer mock-token')
      .send({
        carId: mockCar._id,
        action: 'add'
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal('Added to wishlist');
  });

  it('should submit a new customer review successfully', async () => {
    const res = await request(app)
      .post(`/api/v1/cars/${mockCar._id}/reviews`)
      .set('Authorization', 'Bearer mock-token')
      .send({
        rating: 5,
        review: 'Excellent performance and build quality! Highly recommended.'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('_id');
  });

  it('should return error for review validation bounds (rating < 1)', async () => {
    const res = await request(app)
      .post(`/api/v1/cars/${mockCar._id}/reviews`)
      .set('Authorization', 'Bearer mock-token')
      .send({
        rating: 0,
        review: 'Too short rating'
      });

    // Zod validation returns 422 inside apps/server/src/middleware/error.ts
    expect(res.status).to.equal(422);
    expect(res.body.success).to.be.false;
  });

  it('should delete own customer review', async () => {
    const res = await request(app)
      .delete(`/api/v1/reviews/${mockReview._id}`)
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fetch user wishlist successfully', async () => {
    const res = await request(app)
      .get('/api/v1/cars/wishlist')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
    expect(res.body.data[0]._id).to.equal(mockCar._id);
  });
});
