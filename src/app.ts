import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { zodErrorHandler } from "./middleware/zodErrorHandler";
import voucherRoutes from "./routes/voucher.routes";
import promotionRoutes from "./routes/promotion.routes";
import applyRoutes from "./routes/apply.routes";
import orderRoutes from "./routes/order.routes";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/vouchers", voucherRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/apply", applyRoutes);
app.use("/api/v1/orders", orderRoutes);

// Health Check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use(zodErrorHandler);
// Global errors (Mongo, logic, fallback)
import { globalErrorHandler } from "./middleware/errorHandler";
app.use(globalErrorHandler);

export default app;
