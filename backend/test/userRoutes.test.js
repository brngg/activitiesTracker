const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('User Routes', () => {
  let user;
  let token;

  // Clean up the database before each test and create a test user
  beforeEach(async () => {
    await User.deleteMany({});
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12)
    });
    await user.save();

    // Generate a JWT token for authentication
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

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
    const savedUser = await User.findOne({ email: newUser.email });
    expect(savedUser).toBeTruthy();
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

  it('should get a single user by ID', async () => {
    const response = await request(app).get(`/api/users/${user._id}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(user.username);
    expect(response.body.email).toBe(user.email);
    expect(response.body.password).toBeUndefined();
    expect(response.body._id).toBe(user._id.toString());
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

  // Tests for updating email and password

  it('should update user email with valid data and authentication', async () => {
    const updatedEmail = { email: 'newemail@example.com' };
    const response = await request(app)
      .put('/api/users/email')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedEmail);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email updated successfully');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.email).toBe(updatedEmail.email);
  });

  it('should not update user email without authentication', async () => {
    const updatedEmail = { email: 'newemail@example.com' };
    const response = await request(app)
      .put('/api/users/email')
      .send(updatedEmail);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });

  it('should update user password with valid data and authentication', async () => {
    const updatedPassword = { password: 'newpassword123' };
    const response = await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPassword);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password updated successfully');

    const updatedUser = await User.findById(user._id);
    const isMatch = await bcrypt.compare('newpassword123', updatedUser.password);
    expect(isMatch).toBe(true);
  });

  it('should not update user password without authentication', async () => {
    const updatedPassword = { password: 'newpassword123' };
    const response = await request(app)
      .put('/api/users/password')
      .send(updatedPassword);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });
})