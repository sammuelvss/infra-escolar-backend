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
        description: "Documentação da API Escolar",
      },
    },
   
    apis: [
        "./src/index.ts", // Contém o Login
        "./src/modules/metrics/metrics.controller.ts", // Contém Métricas
        "./src/modules/schools/schools.controller.ts"  // Contém Escolas
    ], 
  };

  const spec = swaggerJsdoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
