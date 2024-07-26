const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Item = require('../src/models/Item');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Item Controller', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Clean up any previous data
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create a new user
    const user = await User.create({ 
      username: 'testuser', 
      email: 'test@example.com', 
      password: await bcrypt.hash('password123', 12) 
    });
    userId = user._id;

    // Generate a token for the new user
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should create a new item with valid data and authentication', async () => {
    const newItem = {
      name: 'New Item',
      type: 'Type A',
      location: {
        neighborhood: 'Downtown',
        borough: 'Manhattan',
        address: '123 Main St',
        zipcode: '10001'
      },
      status: true
    };
    
    // Make the request to create the item
    const response = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(newItem);

    // Log the response status and body for debugging
    // console.log('Response status:', response.status); // Debugging line
    //console.log('Response body:', response.body); // Debugging line

    // Assert the response
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.type).toBe(newItem.type);
    expect(response.body.location).toEqual(newItem.location);
  });
});
