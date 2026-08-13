import {Router} from "express";
import { login } from "../controllers/AuthController";
import rateLimiter from "express-rate-limit";


const router = Router();
const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, 
});

router.post('/login', loginLimiter, login);

export default router;