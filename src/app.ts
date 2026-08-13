import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import userRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';
import helmet from 'helmet';
import cors from 'cors';

const corsOptions = {
    origin: ['http://localhost:3000'], 
};
const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use('/api/users', userRoutes);
app.use('/api/auth', AuthRoutes);

export default app;