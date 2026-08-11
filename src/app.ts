import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import userRoutes from './routes/UserRoutes';

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use('/api/users', userRoutes);

export default app;