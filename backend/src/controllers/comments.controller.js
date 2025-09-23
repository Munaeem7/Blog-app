import { query } from "../utils/db.js"

export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params
    const result = await query(`
      SELECT c.*, u.username as author_name 
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = $1 
      ORDER BY c.created_at DESC
    `, [postId])
    
    res.status(200).json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    })
  }
}

export const getComment = async (req, res) => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM comments WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comment'
    })
  }
}

export const createComment = async (req, res) => {
  try {
    const { content, user_id, post_id, parent_id = null } = req.body
    
    if (!content || !user_id || !post_id) {
      return res.status(400).json({
        success: false,
        message: 'Content, user ID, and post ID are required'
      })
    }
    
    // Check if post exists
    const postCheck = await query('SELECT * FROM posts WHERE id = $1', [postId])
    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }
    
    const result = await query(`
      INSERT INTO comments (content, user_id, post_id, parent_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `, [content, user_id, post_id, parent_id])
    
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create comment'
    })
  }
}

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    
    const commentCheck = await query('SELECT * FROM comments WHERE id = $1', [id])
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }
    
    const result = await query(
      'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
      [content, id]
    )
    
    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    
    const commentCheck = await query('SELECT * FROM comments WHERE id = $1', [id])
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }
    
    await query('DELETE FROM comments WHERE id = $1', [id])
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    })
  }
}