import { z } from 'zod';
import { ValidationError } from '../common/app-error.js';

/**
 * Higher-order function that returns a middleware that validates request data with a Zod schema.
 * @param {import('zod').ZodType} schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Update req properties with validated (coerced/transformed) values
    // In Express v5, query and params are often read-only getters, 
    // so we update their content instead of replacing the object.
    if (validated.body) req.body = validated.body;
    if (validated.query) Object.assign(req.query, validated.query);
    if (validated.params) Object.assign(req.params, validated.params);
    
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      }));
      
      return next(new ValidationError('Validation failed', formattedErrors));
    }
    
    next(err);
  }
};

export default validate;
