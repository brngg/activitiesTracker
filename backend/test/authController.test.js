const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

describe('Auth Controller', () => {
  // Clean up the database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.token).toBeTruthy();

      const user = await User.findOne({ email: newUser.email });
      expect(user).toBeTruthy();
      expect(user.username).toBe(newUser.username);
    });

    it('should not register user with existing username', async () => {
      const existingUser = new User({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      });
      await existingUser.save();

      const newUser = {
        username: 'existinguser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already in use');
    });

    it('should not register user with existing email', async () => {
      const existingUser = new User({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      });
      await existingUser.save();

      const newUser = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const newUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12)
      });
      await newUser.save();
    });

    it('should login a user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
    });

    it('should not login a user with invalid email', async () => {
      const loginData = {
        email: 'invalid@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should not login a user with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
