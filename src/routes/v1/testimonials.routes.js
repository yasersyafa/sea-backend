import { Router } from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../../controllers/testimonials.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllTestimonials);
router.get('/:id', authenticate, getTestimonialById);
router.post('/', authenticate, createTestimonial);
router.put('/:id', authenticate, updateTestimonial);
router.delete('/:id', authenticate, deleteTestimonial);

export default router;
