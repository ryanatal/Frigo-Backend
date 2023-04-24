import express from 'express';
import { addItemToPantry, addItems, getItems } from '../controllers/shoppinglist.js';

const router = express.Router();

router.post('/add', addItems);
router.get('/get', getItems);
router.post('/addToPantry', addItemToPantry);

export default router;