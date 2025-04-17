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

describe('/auth/login', () => {
  it('should not login with wrong username', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admi', password: 'admin123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
  });

  it('should not login with empty username', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: '', password: 'admin123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '123' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
  });

  it('should not login with empty password', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '' });
    expect(res.statusCode).toBe(401);
    expect(res.headers['set-cookie']).toBeNull;
  });

  it('should login admin', async () => {
    const res = await request(app)
    .post('/auth/login')
    .send({ username: 'admin', password: '1234' });

    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();

    const setCookies = res.headers['set-cookie'];
    const setCookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
    const hasAccessToken = setCookiesArray.some((cookie: string) => cookie.includes('accessToken='));
    const hasRefreshToken = setCookiesArray.some((cookie: string) => cookie.includes('refreshToken='));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(hasAccessToken).toBe(true);
    expect(hasRefreshToken).toBe(true);
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies];
  });
});

 describe('/auth/login', () => {
   it('should login user', async () => {
     const response = await request(app)
     .post('/auth/login')
     .send({ username: 'ste', password: '1234' });

     expect(response.statusCode).toBe(200);
     expect(response.headers['set-cookie']).toBeDefined();

     const setCookies = response.headers['set-cookie'];
     const setCookiesArray = Array.isArray(setCookies) ? setCookies : [setCookies];
     const hasAccessToken = setCookiesArray.some((cookie: string) => cookie.includes('accessToken='));
     const hasRefreshToken = setCookiesArray.some((cookie: string) => cookie.includes('refreshToken='));

     expect(response.status).toBe(200);
     expect(response.body.success).toBe(true);
     expect(response.headers['set-cookie']).toBeDefined();
     expect(hasAccessToken).toBe(true);
     expect(hasRefreshToken).toBe(true);
     cookies = Array.isArray(setCookies) ? setCookies : [setCookies];
   });
});

describe('/auth/user', () => {
  it('should access /auth/user with accessToken cookie', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({  "username": "ste", "role": "user", "success": true });
  });

  it('should not access /auth/user without cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    expect(res.status).toBe(401);
  });

  it('should not access /auth/user with old cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', oldCookies);
    expect(res.status).toBe(403);
  });

  it('should not access /auth/user with invalid cookies', async () => {
    const res = await request(app)
    .get('/auth/user')
    .set('Cookie', invalidCookies);
    expect(res.status).toBe(403);
  });
});

describe('/user/ste', () => {
  it('should access protected route with accessToken cookie', async () => {
    const res = await request(app)
    .get('/user/ste')
    .set('Cookie', cookies);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ "success": true,  "data": "ste" });
  });
  it('should NOT access protected route with accessToken cookie', async () => {
    const res = await request(app)
    .get('/user/bob')
    .set('Cookie', cookies);
    expect(res.status).toBe(401);
    //expect(res.body).toEqual({ "success": true,  "data": "ste" });
  });
});

describe('/auth/refresh', () => {
  it('should return a new access token from refresh cookie', async () => {
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

describe('/auth/logout', () => {
  it('should logout invalidating the cookies', async () => {
    const res = await request(app)
    .post('/auth/logout')
    .set('Cookie', cookies);

    const newCookies = res.headers['set-cookie'];
    const expectedAccessTokenCookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const expectedRefreshTokenCookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logged out successfully');
    expect(newCookies[0]).toContain(expectedAccessTokenCookie);
    expect(newCookies[1]).toContain(expectedRefreshTokenCookie);
  });
});

