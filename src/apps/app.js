import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/api.js';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import expressJsdocOptions from '../config/express-jsdoc-options.js';
import * as AppController from './app.controller.js';
import { regularLimiter, apiLimiter } from '../config/rateLimiter.js';
import { jwt_secret } from '../config/env.js';

const app = express();

// TODO!: configure this helmet for production
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(jwt_secret));
app.use(express.static(path.resolve(path.join(process.cwd(), 'src', 'public')))); // prettier-ignore

expressJSDocSwagger(app)(expressJsdocOptions);

app.use('/api', apiLimiter, apiRoutes);
app.use('/health', AppController.getHealthCheck);
app.use('*', regularLimiter, AppController.vueHandler);

app.use(AppController.notFoundHandler);
app.use(AppController.errorHandler);

export default app;
