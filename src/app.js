import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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
import userRouter from './routes/user.routes.js';
import roleRouter from './routes/role.routes.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/roles', roleRouter);

export { app };
