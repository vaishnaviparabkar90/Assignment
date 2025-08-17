
import express from 'express';
import { getStoresWithRatings, upsertRating } from '../controllers/userController.js';
const router = express.Router();
router.get('/stores', getStoresWithRatings);   
router.post('/ratings', upsertRating);        
export default router;
