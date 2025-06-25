import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  loginUser
} from '../../controllers/user.controller.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser)

export default router;
