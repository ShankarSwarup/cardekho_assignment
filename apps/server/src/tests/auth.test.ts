import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { UserRepository } from '../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';

describe('Auth API Endpoint Tests (Mocked DB)', () => {
  const testUser = {
    fullName: 'Test User',
    email: 'testuser@example.com',
    password: 'Password@123'
  };

  before(() => {
    UserRepository.prototype.findByEmail = async function(email: string) {
      if (email === 'testuser@example.com') {
        return {
          _id: '507f1f77bcf86cd799439099',
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: bcrypt.hashSync('Password@123', 10),
          role: 'user',
          wishlist: [],
          toObject() { return this; }
        } as any;
      }
      return null;
    };

    UserRepository.prototype.create = async function(userData: any) {
      return {
        _id: '507f1f77bcf86cd799439099',
        fullName: userData.fullName,
        email: userData.email,
        role: 'user',
        wishlist: [],
        toObject() { return this; }
      } as any;
    };
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'New User',
        email: 'newuser@example.com',
        password: 'Password@123'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('userId');
  });

  it('should authenticate user and return access token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('accessToken');
  });

  it('should return error for invalid login credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123'
      });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});
