import type { RequestHandler } from 'express';
import type { z } from 'zod';

export function validateBody(schema: z.ZodType) : RequestHandler {
  return (request, _response, next) => {
    request.body = schema.parse(request.body);
    next();
  };
}

export function validateQuery(schema: z.ZodType) : RequestHandler {
  return (request, _response, next) => {
    request.query = schema.parse(request.query) as typeof request.query;
    next();
  };
}
