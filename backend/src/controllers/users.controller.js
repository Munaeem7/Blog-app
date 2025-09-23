import { query } from "../utils/db.js"

export const getAllUsers = async (req, res) => {
  try {
    const result = await query('SELECT id, username, email, created_at FROM users ORDER BY username')
    res.status(200).json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
}

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      })
    }
    
    // Check if username or email already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      })
    }
    
    // In a real application, you would hash the password here
    const result = await query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password]
    )
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { username, email } = req.body
    
    const userCheck = await query('SELECT * FROM users WHERE id = $1', [id])
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // Check if new username or email already exists (excluding current user)
    const existingUser = await query(
      'SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3',
      [username, email, id]
    )
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      })
    }
    
    const result = await query(
      'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id = $3 RETURNING id, username, email, created_at',
      [username, email, id]
    )
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    
    const userCheck = await query('SELECT * FROM users WHERE id = $1', [id])
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // Check if user has posts
    const postsCheck = await query('SELECT COUNT(*) FROM posts WHERE author_id = $1', [id])
    const postCount = parseInt(postsCheck.rows[0].count)
    
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user as they have ${postCount} post(s)`
      })
    }
    
    await query('DELETE FROM users WHERE id = $1', [id])
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}