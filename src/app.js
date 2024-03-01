import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// import routes
import router from './routes/router.js';

app.use('/api/v1', router);

const APP_PATH = dirname(fileURLToPath(import.meta.url));
// console.log(APP_PATH);
export { app, APP_PATH };
