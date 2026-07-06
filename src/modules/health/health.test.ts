import request from 'supertest';
import app from '../../app';

describe('Health Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 and status UP', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'UP');
      expect(res.body.data).toHaveProperty('timestamp');
    });
  });
});
