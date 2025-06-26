import { Router } from "express"
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware.js"

const router = Router()

router.route('/')
    .get(authenticate, () => console.log('hello world from menu end point'))
    .post(authenticate, authorizeRoles('Admin'), () => console.log('create menu'))

router.route('/:id')
    .patch(authenticate, authorizeRoles('Admin'), () => console.log('Update the menu by id'))
    .delete(authenticate, authorizeRoles('Admin'), () => console.log('deleting menu by id'))

export default router
