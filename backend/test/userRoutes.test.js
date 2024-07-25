// test/userRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

describe('User Routes', () => {
  it('should return status 200 for GET /api/users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
  });

  it('should return JSON data for GET /api/users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.type).toBe('application/json');
  });

  it('should create a new user with valid data', async () => {
    const newUser = {
      username: 'validuser',
      email: 'valid@example.com',
      password: 'password123'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBeUndefined();
    // Check if the user was actually saved to the database
    const user = await User.findOne({ email: newUser.email });
    expect(user).toBeTruthy();
  });

  it('should return 400 for username with spaces', async () => {
    const newUser = {
      username: 'invalid user',
      email: 'test@example.com',
      password: 'password123'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Username can only contain letters, numbers, and underscores');
  });

  it('should return 400 for username with special characters', async () => {
    const newUser = {
      username: 'invalid@user',
      email: 'test@example.com',
      password: 'password123'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Username can only contain letters, numbers, and underscores');
  });

  it('should return 400 for duplicate username', async () => {
    const existingUser = new User({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123'
    });
    await existingUser.save();
    const newUser = {
      username: 'existinguser',
      email: 'new@example.com',
      password: 'password123'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Username already exists');
  });

  it('should return 400 for invalid email format', async () => {
    const newUser = {
      username: 'validuser',
      email: 'invalidemail',
      password: 'password123'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid email format');
  });

  it('should return 400 for invalid user ID format', async () => {
    const response = await request(app).get('/api/users/invalidid');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid user ID');
  });

  // New tests for getting user by ID

  it('should get a single user by ID', async () => {
    const newUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await newUser.save();

    const response = await request(app).get(`/api/users/${newUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.password).toBeUndefined();
    expect(response.body._id).toBe(newUser._id.toString());
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/users/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 400 for invalid user ID format', async () => {
    const response = await request(app).get('/api/users/invalidid');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid user ID');
  });
});