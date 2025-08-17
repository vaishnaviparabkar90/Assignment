import express from 'express';
import { getDashboard, listUsersOrStores, addUser } from '../controllers/adminController.js';

const router = express.Router();
router.get('/dashboard', getDashboard);
router.get('/list', listUsersOrStores);
router.post('/users', addUser);

export default router;
