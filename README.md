# Express.js Production Boilerplate 🚀

A production-ready Node.js & Express.js backend boilerplate built with TypeScript, Drizzle ORM, Zod, and full observability (Prometheus, Grafana, Loki, Sentry). 

This setup is designed for building highly scalable and maintainable RESTful APIs with automatic Swagger documentation.

## 🛠 Tech Stack

- **Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Docker)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **API Documentation**: [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) & Swagger UI
- **Logging**: [Winston](https://github.com/winstonjs/winston) + [Morgan](https://github.com/expressjs/morgan)
- **Monitoring**: [Sentry](https://sentry.io/) (Error Tracking) + [Prometheus](https://prometheus.io/) (Metrics)
- **Dashboards**: [Grafana](https://grafana.com/) & [Loki](https://grafana.com/oss/loki/)
- **Testing**: [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest)

## 📁 Project Structure

```text
src/
├── config/              # Environment variables and configs
├── db/                  # Drizzle ORM setup & schema definitions
├── docs/                # OpenAPI & Swagger UI setup
├── middlewares/         # Global middlewares (Error handling, Validation)
├── modules/             # Feature-based architecture (e.g. Health, Users)
├── utils/               # Custom utilities (ApiError, catchAsync, Logger, Monitoring)
├── app.ts               # Express App setup (Middlewares, routes)
└── server.ts            # Server entry point
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 2. Installation

Clone this repository and install the dependencies:

```bash
git clone https://github.com/developersayem/express-production-boilerplate.git
cd express-production-boilerplate
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (based on `.env.example` if available) or use this default for local development:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgres://admin:adminpassword@localhost:5432/blb_travel_db"
SENTRY_DSN=""
LOKI_HOST="http://localhost:3100"
```

### 4. Start the Observability Stack (Docker)
This project comes with a comprehensive `docker-compose.yml` that sets up PostgreSQL, Prometheus, Grafana, and Loki.

```bash
docker-compose up -d
```

### 5. Database Migrations
Push your initial Drizzle schema to the local PostgreSQL database:
```bash
npm run db:push
```

### 6. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Endpoints & Dashboards

- **API Base URL**: `http://localhost:3000/api`
- **Swagger Documentation**: `http://localhost:3000/docs`
- **Prometheus Metrics**: `http://localhost:3000/metrics`
- **Grafana Dashboard**: `http://localhost:3001` (Default login: `admin` / `admin`)

## 🧪 Testing

Run the automated test suite (Jest + Supertest):
```bash
npm run test
```

## 📝 Creating a New Module
1. Create a new folder inside `src/modules/` (e.g., `user`).
2. Add `user.controller.ts`, `user.route.ts`, and `user.schema.ts`.
3. Register the Zod schema in `src/docs/openapi.ts` for Swagger documentation.
4. Mount the route in `src/app.ts`.
