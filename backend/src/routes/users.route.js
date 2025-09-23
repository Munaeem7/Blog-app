import express from 'express'
const router = express.Router()
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js'

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router