// routes/contact.routes.js
import express from 'express'
import { 
  contactInfo, 
  getAllContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact, 
  getContactStats 
} from '../controllers/contact.controller.js'

const router = express.Router()

// POST - Create new contact submission
router.post("/", contactInfo)

// GET - Get all contact submissions with pagination and filtering
router.get("/", getAllContacts)

// GET - Get contact submission by ID
router.get("/:id", getContactById)

// PUT - Update contact submission status
router.put("/:id", updateContactStatus)

// DELETE - Delete contact submission
router.delete("/:id", deleteContact)

// GET - Get contact statistics
router.get("/stats/summary", getContactStats)

export default router