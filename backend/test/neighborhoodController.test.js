const request = require('supertest');
const app = require('../src/app');

describe('Neighborhood Routes', () => {
    
  describe('GET /api/neighborhoods', () => {
    it('should return all boroughs', async () => {
      const response = await request(app).get('/api/neighborhoods');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
      expect(response.body).toContain('Manhattan');
      expect(response.body).toContain('Brooklyn');
      expect(response.body).toContain('Queens');
      expect(response.body).toContain('Bronx');
      expect(response.body).toContain('Staten Island');
    });
  });

  describe('GET /api/neighborhoods/:borough', () => {
    it('should return neighborhoods in the specified borough', async () => {
        const borough = 'Brooklyn';
        const response = await request(app).get(`/api/neighborhoods/${borough}`);
        //console.log('Response:', response.body);
        // Log the response body to see what data is returned
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        //console.log('Neighborhoods in response:', response.body);
        expect(response.body.length).toBeGreaterThan(0); // Ensure some data is returned
        expect(response.body).toContain('Williamsburg');
        expect(response.body).toContain('Bushwick');
      });
      

    it('should return 404 for a non-existent borough', async () => {
      const borough = 'NonExistentBorough';
      const response = await request(app).get(`/api/neighborhoods/${borough}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/neighborhoods/:borough/:neighborhood', () => {
    it('should return zip codes for the specified borough and neighborhood', async () => {
      const borough = 'Manhattan';
      const neighborhood = 'Harlem';
      const response = await request(app).get(`/api/neighborhoods/${borough}/${neighborhood}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toContain('10026');
    });

    it('should return 404 for a non-existent neighborhood', async () => {
      const borough = 'Manhattan';
      const neighborhood = 'NonExistentNeighborhood';
      const response = await request(app).get(`/api/neighborhoods/${borough}/${neighborhood}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No zipcodes found for the requested borough and neighborhood.');
    });

    it('should return 404 for a non-existent borough', async () => {
      const borough = 'NonExistentBorough';
      const neighborhood = 'Harlem';
      const response = await request(app).get(`/api/neighborhoods/${borough}/${neighborhood}`);
      expect(response.status).toBe(404);
    });
  });
});