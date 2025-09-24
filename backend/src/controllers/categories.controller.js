import { query } from "../utils/db.js"

export const getAllCategories = async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(p.id) AS post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `)
    res.status(200).json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    })
  }
}


export const getCategory = async (req, res) => {
  try {
    const { id } = req.params
    const result = await query(`
      SELECT c.*, COUNT(p.id) AS post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    })
  }
}


export const createCategory = async (req, res) => {
  try {
    const { name, description , slug } = req.body
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
    }
    
    const result = await query(
      'INSERT INTO categories (name, description , slug) VALUES ($1, $2 , $3) RETURNING *',
      [name, description , slug]
    )
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    
    const categoryCheck = await query('SELECT * FROM categories WHERE id = $1', [id])
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    const result = await query(
      'UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name, description, id]
    )
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    
    const categoryCheck = await query('SELECT * FROM categories WHERE id = $1', [id])
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    // Check if category is being used by any posts
    const postsCheck = await query('SELECT COUNT(*) FROM posts WHERE category_id = $1', [id])
    const postCount = parseInt(postsCheck.rows[0].count)
    
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category as it is used by ${postCount} post(s)`
      })
    }
    
    await query('DELETE FROM categories WHERE id = $1', [id])
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    })
  }
}