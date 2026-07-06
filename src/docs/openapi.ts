import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Register Bearer Auth
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// A dummy component to test Zod to OpenAPI
export const HealthResponseSchema = registry.register(
  'HealthResponse',
  z.object({
    status: z.string().openapi({ example: 'UP' }),
    timestamp: z.string().openapi({ example: '2026-07-06T12:00:00Z' }),
  })
);

registry.registerPath({
  method: 'get',
  path: '/api/health',
  summary: 'Check server health',
  description: 'Returns the health status of the API server.',
  responses: {
    200: {
      description: 'API is healthy',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

export const setupSwagger = (app: Application) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const swaggerDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'BLB Travel Backend API',
      description: 'API documentation for BLB Travel Admin Portal',
    },
    servers: [{ url: '/api' }],
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};
