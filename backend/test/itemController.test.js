const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Item = require('../src/models/Item');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Item Controller', () => {
  let token;
  let userId;
  let itemId;

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

    // Create a new item
    const item = await Item.create({
      name: 'Initial Item',
      type: 'Type A',
      location: {
        neighborhood: 'Downtown',
        borough: 'Manhattan',
        address: '123 Main St',
        zipcode: '10001'
      },
      status: true,
      user: userId
    });
    itemId = item._id;
  });

  it('should create a new item with valid data and authentication', async () => {
    const newItem = {
      name: 'New Item',
      type: 'Type B',
      location: {
        neighborhood: 'Uptown',
        borough: 'Brooklyn',
        address: '456 Elm St',
        zipcode: '11201'
      },
      status: false
    };

    const response = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send(newItem);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.type).toBe(newItem.type);
    expect(response.body.location).toEqual(newItem.location);
  });

  it('should update an existing item with valid data and authentication', async () => {
    const updates = {
      name: 'Updated Item',
      status: false
    };

    const response = await request(app)
      .put(`/api/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updates.name);
    expect(response.body.status).toBe(updates.status);
  });

  it('should delete an existing item with valid data and authentication', async () => {
    const response = await request(app)
      .delete(`/api/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item deleted successfully');
  });

  it('should save an item for the user', async () => {
    const response = await request(app)
      .post(`/api/items/save/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item saved successfully');

    const user = await User.findById(userId);
    expect(user.savedItems).toContainEqual(itemId);
  });

  it('should unsave an item for the user', async () => {
    // First, save the item
    await request(app)
      .post(`/api/items/save/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .post(`/api/items/unsave/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item unsaved successfully');

    const user = await User.findById(userId);
    expect(user.savedItems).not.toContainEqual(itemId);
  });

  it('should get saved items for the user', async () => {
    // Save the item first
    await request(app)
      .post(`/api/items/save/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    // Get the saved items
    const response = await request(app)
      .get('/api/items/saved')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id.toString()).toBe(itemId.toString());
  });
});
