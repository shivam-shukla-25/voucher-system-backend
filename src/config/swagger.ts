import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Voucher & Promotion API",
      version: "1.0.0",
      description: "API documentation for Voucher System",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: [path.join(__dirname, "../../swagger.yaml")],
});
