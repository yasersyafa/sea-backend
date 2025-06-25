import { Router } from 'express';
import {
  createSubscription,
  getAllSubscriptions,
  getOwnSubscription
} from '../../controllers/subscription.controller.js';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createSubscription);
router.get('/', authenticate, getAllSubscriptions);

export default router;
