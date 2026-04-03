# 🚀 Xpress.js-Template

A robust, scalable, and modular backend API template built with **Node.js 20+**, **Express.js v5**, and **Sequelize v6**. Following **Clean Architecture** and **Dependency Injection** principles.

---

## 📦 Features & Tech Stack

- **Runtime**: Node.js 20+ (ESM)
- **Framework**: Express.js v5 (Beta)
- **ORM**: Sequelize v6 (Dual DB: PostgreSQL & MySQL)
- **DI Container**: Awilix
- **Auth**: JWT (AccessToken + RefreshToken) & BcryptJS
- **Validation**: Zod
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Logging**: Winston + Morgan (RequestId tracing)
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier
- **Dev Tools**: Nodemon, Docker Compose

---

## 🗂️ Project Structure

```text
src/
├── common/             # Base classes, constants, utilities
├── config/             # Configuration (DB, JWT, Logger, DI)
├── database/           # Migrations, Seeders, DB Init
├── middleware/         # Global & specific middlewares
├── modules/            # Business Logic per module (User, Auth)
│   ├── auth/
│   └── user/
├── app.js              # Express app setup
└── server.js           # Entry point & Graceful shutdown
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose (optional but recommended)

### 2. Environment Setup
Copy the example environment file and update the values:
```bash
cp .env.example .env
```

### 3. Database Setup (Docker)
Start the database services:
```bash
docker-compose up -d
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Migrations & Seeders
```bash
npm run migrate
npm run seed
```

---

## 🛠️ Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with Nodemon
- `npm test`: Run tests with Jest
- `npm run lint`: Lint code with ESLint
- `npm run format`: Format code with Prettier
- `npm run migrate`: Run database migrations
- `npm run seed`: Run database seeders

---

## 🔐 API Documentation (Summary)

### Auth Module
- `POST /api/v1/auth/register`: Register new user
- `POST /api/v1/auth/login`: Login & get tokens
- `POST /api/v1/auth/refresh`: Refresh expired access token
- `POST /api/v1/auth/logout`: Revoke refresh token

### User Module
- `GET /api/v1/users`: List users (ADMIN only)
- `GET /api/v1/users/me`: Get own profile
- `GET /api/v1/users/:id`: Get user detail
- `PUT /api/v1/users/:id`: Update user
- `DELETE /api/v1/users/:id`: Soft delete user (ADMIN only)

---

## 🛡️ Security & Best Practices

- **RBAC**: Role-Based Access Control implemented on routes.
- **Graceful Shutdown**: Handles SIGTERM/SIGINT, draining connections.
- **Standardized Responses**: Using `ApiResponse` wrapper for all success/error outputs.
- **Soft Delete**: Uses Sequelize `paranoid` mode for user data safety.
- **Request ID**: Every request is tagged with a UUID for easier log tracing.

---

## 📝 License
MIT License

Copyright (c) 2026 Darma Putra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

