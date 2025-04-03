import request from 'supertest';
import app from './index';

let cookies: string[];

const invalidCookies =  [
  'accessToken=ABCD1234; Max-Age=900; Path=/; Expires=Thu, 03 Apr 2025 19:16:04 GMT; HttpOnly; Secure; SameSite=Strict',
  'refreshToken=ABCD1234; Max-Age=604800; Path=/; Expires=Thu, 10 Apr 2025 19:01:04 GMT; HttpOnly; Secure; SameSite=Strict'
]

const oldCookies =  [
  'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQzNzA2ODY0LCJleHAiOjE3NDM3MDc3NjR9.OctWP6AY6HrTySpv4rXXvheeUh32g9KmPcwOdzXstZE; Max-Age=900; Path=/; Expires=Thu, 03 Apr 2000 19:16:04 GMT; HttpOnly; Secure; SameSite=Strict',
  'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQzNzA2ODY0LCJleHAiOjE3NDQzMTE2NjR9.uwao1jiLL3wF_Q4KNuHgi8mOsdZiHy9tO9E2gNEDTyA; Max-Age=604800; Path=/; Expires=Thu, 10 Apr 2000 19:01:04 GMT; HttpOnly; Secure; SameSite=Strict'
]

describe('Auth Routes', () => {
  it('/auth/login should not login (wrong username)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admi', password: 'admin123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
    const rawCookies = res.headers['set-cookie']; // Save cookies for next request
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

  it('/auth/login should not login (empty username)', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: '', password: 'admin123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
    const rawCookies = res.headers['set-cookie']; // Save cookies for next request
    cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
  });

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

  it('/auth/user should not access protected route without cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    expect(res.status).toBe(401);
  });

  it('/auth/user should not access protected route with old cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', oldCookies);
    expect(res.status).toBe(403);
  });

  it('/auth/user should not access protected route with invalid cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', invalidCookies);
    expect(res.status).toBe(403);
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

