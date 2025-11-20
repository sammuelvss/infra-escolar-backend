import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Dashboard API",
        version: "1.0.0",
      },
    },
    apis: ["./src/modules/**/*.ts", "./src/index.ts"], 
  };

  const spec = swaggerJsdoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}