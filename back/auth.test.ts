import request from 'supertest';
import app from './index';

let cookies: string[];

describe('Auth Routes', () => {
  it('/auth/login should not login (wrong password)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
    const rawCookies = res.headers['set-cookie']; // Save cookies for next request
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

  it('/auth/login should not login (empty password)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
    const rawCookies = res.headers['set-cookie']; // Save cookies for next request
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

  it('/auth/login should login and receive cookies', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: 'admin123' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    const rawCookies = res.headers['set-cookie']; // Save cookies for next request
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

  it('/auth/user should not access protected route without accessToken cookie', async () => {
    const res = await request(app)
    .get('/auth/user')
    expect(res.status).toBe(401);
  });

  it('/auth/user should access protected route with accessToken cookie', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ "role": "admin", "success": true });
  });
  
  it('/auth/refresh should return a new access token from refresh cookie', async () => {
    const res = await request(app)
    .post('/auth/refresh')
    .set('Cookie', cookies);
    const setCookies = res.headers['set-cookie'];
    const setCookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
    const hasAccessToken = setCookiesArray.some((cookie: string) => cookie.includes('accessToken='));
    const hasRefreshToken = setCookiesArray.some((cookie: string) => cookie.includes('refreshToken='));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(hasAccessToken).toBe(true);
    expect(hasRefreshToken).toBe(true);
  });

});

