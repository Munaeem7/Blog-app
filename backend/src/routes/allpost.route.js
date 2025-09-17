import express from 'express'
const router = express.Router()
import { allPost, createAPost, getAspecificPost } from '../controllers/allpost.controller.js'
//get all posts
router.get("/allposts",allPost)
//create a post
router.post("/post", createAPost)
//get a specific post
router.get("/post/:id",getAspecificPost)

export default router

