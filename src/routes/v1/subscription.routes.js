import { Router } from 'express';
import {
  createSubscription,
  getAllSubscriptions
} from '../../controllers/subscription.controller.js';

const router = Router();

router.post('/', createSubscription);
router.get('/', getAllSubscriptions);

export default router;
