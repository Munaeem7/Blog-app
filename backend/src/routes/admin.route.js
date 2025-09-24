import express from 'express'
import {login,logout, checkAuth} from '../controllers/admin.authentication.js'
import {protectRoute} from '../middlewares/protectRoute.js'
const router = express.Router()


router.post('/login', login)
router.post('/logout', logout)
router.get("/check",protectRoute,checkAuth)
export default router