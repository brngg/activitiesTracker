const request = require('supertest');
const app = require('../src/app'); // Adjust this path to where your Express app is defined
const User = require('../src/models/User'); // Adjust this path to your User model

describe('User Routes', () => {
  it('should return status 200 for GET /api/users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
  });

  it('should return JSON data for GET /api/users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.type).toBe('application/json');
  });

  it('should create a new user with POST /api/users', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);

    // Check if the user was actually saved to the database
    const user = await User.findOne({ email: newUser.email });
    expect(user).toBeTruthy();
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/nonexistentid');
    expect(response.status).toBe(404);
  });
});