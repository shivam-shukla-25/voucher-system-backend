# Voucher & Promotion System – Backend

A scalable Node.js + TypeScript backend for managing vouchers, promotions, discount rules, and order-level discount application. Supports validation, rate limiting, unique code handling, promotions with product/category eligibility, expiration logic, soft delete, and full Swagger documentation.

**🚀 Live Deployment**: [https://voucher-system-backend-javm.onrender.com/health](https://voucher-system-backend-javm.onrender.com/health)  
**📖 API Docs**: [https://voucher-system-backend-javm.onrender.com/docs](https://voucher-system-backend-javm.onrender.com/docs)

---

## 🚀 Features

- Voucher management (create, update, soft delete)
- Promotion management with eligibility rules
- Discount application engine (supports items only, orderId only, or both)
- Order management with subtotal/total calculation
- Zod validation with user-friendly error messages
- Rate limiting (60 requests/minute per IP)
- Global error handler
- Mongoose ODM
- Swagger API documentation (`/docs`)
- Jest tests + SuperTest + coverage report
- Render deployment ready

---

## 📁 Project Structure

```
src/
  app.ts
  server.ts  
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
tests/
swagger.yaml
```

## 🛠 Tech Stack

- Node.js + TypeScript
- Express 5
- Mongoose
- Zod
- Swagger (swagger-jsdoc + swagger-ui-express)
- Jest + Supertest
- Rate Limiting (express-rate-limit)
- Helmet + CORS
- Render Deployment

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/shivam-shukla-25/voucher-system-backend.git
cd voucher-system-backend
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/voucherdb
PORT=5000
```

For test environment:

```env
MONGO_URI=mongodb://127.0.0.1:27017/voucher-test
```

---

## 🚀 Running the Project

**Development:**

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

**Production Build:**

```bash
npm run build
npm start
```

---

## 📘 API Documentation (Swagger UI)

Once running, open: `http://localhost:5000/docs`

Swagger loads documentation from: `swagger.yaml`

---

## 🧪 Running Tests

Run test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test -- --coverage
```

Coverage target (currently ~70%+):
- Services
- Controllers
- API routes
- Apply logic

---

## 📡 API Overview

### Voucher Routes

```
POST   /api/v1/vouchers
GET    /api/v1/vouchers
GET    /api/v1/vouchers/:code
PUT    /api/v1/vouchers/:code
DELETE /api/v1/vouchers/:code
```

### Promotion Routes

```
POST   /api/v1/promotions
GET    /api/v1/promotions
GET    /api/v1/promotions/:code
PUT    /api/v1/promotions/:code
DELETE /api/v1/promotions/:code
```

### Apply Logic

```
POST /api/v1/apply
```

Supports:
- items only
- orderId only
- items + orderId

### Orders

```
POST /api/v1/orders
GET  /api/v1/orders
GET  /api/v1/orders/:id
```

---

## 🛡 Error Handling

**Validation Errors:**

```json
{
  "status": "error",
  "errors": [
    { "field": "items.0.quantity", "message": "quantity must be greater than 0" }
  ]
}
```

**Invalid ObjectId:**

```json
{
  "status": "error",
  "message": "Invalid ID format"
}
```

**Business Rule Errors (422):**

```json
{
  "status": "error",
  "message": "Minimum order value not met"
}
```

**Duplicate Code (409):**

```json
{
  "status": "error",
  "message": "Code already exists"
}
```

---

## ☁️ Deploying to Render

### 1. Push code to GitHub

Make sure `.gitignore` contains:

```
node_modules
dist
.env
.env.test
coverage
```

### 2. Create Render Web Service

- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Add environment variables in Render console

### 3. After deploy

Check:
- `https://your-app.onrender.com/health`
- `https://your-app.onrender.com/docs`

---

## 🧩 Future Enhancements

- JWT authentication
- RBAC for voucher/promotion admin panel
- Redis caching
- Webhook support for events
- Batch voucher creation

---

## 👤 Author

**Shivam Shukla**  
Node.js | TypeScript | MERN | System Architecture
