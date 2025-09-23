import express from 'express'
const router = express.Router()
import { 
  allPost, 
  createAPost, 
  getAspecificPost, 
  updatePost, 
  deletePost 
} from '../controllers/allpost.controller.js'

// Get all posts with pagination
router.get("/allposts", allPost)

// Create a post
router.post("/post", createAPost)

// Get a specific post
router.get("/post/:id", getAspecificPost)

// Update a post
router.put("/post/:id", updatePost)

// Delete a post
router.delete("/post/:id", deletePost)

export default router