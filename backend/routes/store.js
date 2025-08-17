import express from 'express';
import { UpdatePassword,dashboard } from '../controllers/storeController.js';

const router = express.Router();
router.get('/:email/dashboard', dashboard);
router.get('/update-password', UpdatePassword);
export default router;
