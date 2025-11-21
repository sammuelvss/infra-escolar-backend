import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import path from "path";

export function setupSwagger(app: Express) {
  
  // Pega o diretório raiz do projeto
  const rootDir = process.cwd();

  console.log("🔍 Swagger procurando arquivos em:", rootDir);

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Dashboard API",
        version: "1.0.0",
        description: "Documentação automática da API",
      },
    },
    // Caminhos explícitos e absolutos
    apis: [
        path.join(rootDir, "src/index.ts"), 
        path.join(rootDir, "src/modules/metrics/metrics.controller.ts"),
        path.join(rootDir, "src/modules/auth/auth.controller.ts") 
    ], 
  };

  const spec = swaggerJsdoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}