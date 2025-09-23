import { query } from "../utils/db.js"

export const getAllSubscribers = async (req, res) => {
  try {
    const result = await query('SELECT * FROM subscribers ORDER BY created_at DESC')
    res.status(200).json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    })
  }
}

export const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }
    
    // Check if email already exists
    const existingSubscriber = await query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email]
    )
    
    if (existingSubscriber.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed'
      })
    }
    
    const result = await query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
      [email]
    )
    
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating subscriber:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe'
    })
  }
}

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params
    
    const subscriberCheck = await query('SELECT * FROM subscribers WHERE id = $1', [id])
    if (subscriberCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      })
    }
    
    await query('DELETE FROM subscribers WHERE id = $1', [id])
    
    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber'
    })
  }
}