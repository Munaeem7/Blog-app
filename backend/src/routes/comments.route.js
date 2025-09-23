import express from 'express'
const router = express.Router()
import {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  getComment
} from '../controllers/comments.controller.js'

router.get('/post/:postId', getPostComments)
router.get('/:id', getComment)
router.post('/', createComment)
router.put('/:id', updateComment)
router.delete('/:id', deleteComment)

export default router   