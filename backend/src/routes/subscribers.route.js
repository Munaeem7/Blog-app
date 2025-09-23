import express from 'express'
const router = express.Router()
import {
  getAllSubscribers,
  createSubscriber,
  deleteSubscriber
} from '../controllers/subscribers.controller.js'

router.get('/', getAllSubscribers)
router.post('/', createSubscriber)
router.delete('/:id', deleteSubscriber)

export default router