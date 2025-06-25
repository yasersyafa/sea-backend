import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  loginUser
} from '../../controllers/user.controller.js';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser)

export default router;
