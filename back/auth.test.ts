import request from 'supertest';
import app from './index';

let accessToken: string;
let refreshToken: string;

describe('Auth Routes', () => {
  it('login admin fail (empty password)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ success: false, error: 'Invalid credentials', });
  });

  it('login admin fail (wrong password)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ success: false, error: 'Invalid credentials', });
  });

  it('login admin success', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');

    accessToken = res.body.accessToken; // needed for the tests bellow
    refreshToken = res.body.refreshToken; // needed for the tests bellow
  });

  it('use accessToken to get user data', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, role: 'admin' });
  })

  it('should return a new access token using refresh token', async () => {
    const res = await request(app)
    .post('/auth/refresh')
    .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.success).toBe(true);
  });

  it('should fail with missing refresh token', async () => {
    const res = await request(app)
    .post('/auth/refresh')
    .send({});

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No refresh token provided');
  });

  it('should fail with invalid refresh token', async () => {
    const res = await request(app)
    .post('/auth/refresh')
    .send({ refreshToken: 'not.a.valid.token' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired refresh token');
  });

});

