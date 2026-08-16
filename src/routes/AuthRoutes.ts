import { Router } from 'express';
import { login } from '../controllers/AuthController';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../lib/redis';

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

router.post('/login', loginLimiter, login);

export default router;