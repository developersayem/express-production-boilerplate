# 🧪 Testing & Monitoring Guide for BLB Travel Backend

This guide explains how the testing and monitoring setup works in this project in simple terms.

---

## 1. Testing (Jest & Supertest)

Testing ensures that your code works as expected without you having to manually check it with Postman every time.

### How to Run Tests
Open your terminal in the backend folder and run:
```bash
npm run test
```
Jest will automatically find files ending with `.test.ts` and run them.

### What are we testing?
We do **E2E (End-to-End) Testing**. It means we write a script that pretends to be a real user making an HTTP request (like a GET or POST) to our Express API, and then checks if the response is correct.

**Example (from `src/modules/health/health.test.ts`):**
```typescript
import request from 'supertest';
import app from '../../app';

describe('Health Endpoints', () => {
  it('should return 200 and status UP', async () => {
    // Supertest sends a fake GET request to our app
    const res = await request(app).get('/api/health');
    
    // We expect the server to say "Everything is OK (200)"
    expect(res.statusCode).toEqual(200);
    // We expect the JSON body to have { status: "UP" }
    expect(res.body).toHaveProperty('status', 'UP');
  });
});
```
When you create new features (e.g., Booking a package), you will create a `booking.test.ts` to automatically test that it works.

---

## 2. Monitoring (Prometheus & Grafana)

Monitoring helps you understand the health of your server in production. Are there too many users? Is the server slow? 

### How it works:
1. **Prometheus (`prom-client`)**: In `src/app.ts` and `src/utils/monitoring.ts`, we set up code that tracks every request (e.g., how many milliseconds a `/api/health` request takes). This data is exposed at `http://localhost:3000/metrics`.
2. **Prometheus Server**: The Docker container named `blb_prometheus` automatically visits your `/metrics` page every 15 seconds to collect and store the data.
3. **Grafana**: The Docker container named `blb_grafana` takes the data from Prometheus and turns it into beautiful charts and dashboards.

### How to see it:
1. Ensure your docker containers are running: `docker-compose up -d`
2. Open Grafana in your browser: `http://localhost:3001`
3. Log in with `admin` / `admin`.
4. You can create a dashboard and select "Prometheus" as the data source to see API request speeds!

---

## 3. Logging (Winston & Grafana Loki)

Logging is essential to know *what* happened when a user reports a bug.

### How it works:
Normally, developers use `console.log()`. But in production, `console.log()` is lost when the server restarts.
We use **Winston**. In `src/utils/logger.ts`, Winston is configured to send all logs to **Grafana Loki** (running in Docker).

```typescript
import { logger } from '../utils/logger';

// Use this instead of console.log
logger.info("A user just booked a flight!");
logger.error("Database connection failed!");
```

### How to see it:
You can view these logs in Grafana (`http://localhost:3001`) by selecting "Loki" in the Explore tab. It allows you to search through millions of logs in seconds.

---

## 4. Error Tracking (Sentry)

If a user experiences a crash (e.g., the server gives a 500 error), you might not know unless they tell you.
**Sentry** automatically catches unhandled errors and sends an alert to your Sentry dashboard.

### How to set it up:
1. Go to [sentry.io](https://sentry.io/) and create a free account.
2. Create a new Node.js/Express project.
3. Get the **DSN URL** and paste it into your `.env` file:
   ```env
   SENTRY_DSN="https://your_dsn_key@sentry.io/project_id"
   ```
4. Now, any crashed code will show up on Sentry with the exact line number of the code that caused the crash!
