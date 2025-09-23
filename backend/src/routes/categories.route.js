import express from 'express'
const router = express.Router()
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js'

router.get('/', getAllCategories)
router.get('/:id', getCategory)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router