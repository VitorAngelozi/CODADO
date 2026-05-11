import express from 'express';
import cors from 'cors';
import quizRoutes from './routes/quizRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Accept-Encoding',
      'X-CSRF-Token',
      'Authorization',
      'accept',
      'origin',
      'Cache-Control',
      'X-Requested-With',
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use('/', quizRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`Servidor Codado iniciado em http://localhost:${PORT}`);
  console.log(
    'Endpoints: GET /health, GET /levels, GET /questions?level=easy, POST /submit, POST /bug-hunt/run'
  );
});

export default app;
