import rateLimit from 'express-rate-limit';

/* Limiting the number of requests that can be made to the API. */
export const regularLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Limiting the number of requests that can be made to the API. */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  statusCode: 429,
  message: {
    status: 'fail',
    request_url: async (request, response) => request.originalUr,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
