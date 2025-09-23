import { query } from "../utils/db.js"

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const allPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get posts with category information only (no user data)
    const posts = await query(`
      SELECT p.*, c.name as category_name
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    // Get total count for pagination
    const totalResult = await query(`SELECT COUNT(*) FROM posts`);
    const total = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      data: posts.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};

export const createAPost = async (req, res) => {
  try {
    const { title, slug, content, excerpt, category, cover_image, read_time } = req.body;
    console.log(req.body)
    
    // Validation
    if (!title || !content || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and slug are required'
      });
    }
    
    // Check if slug already exists
    const slugCheck = await query('SELECT id FROM posts WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A post with this slug already exists'
      });
    }
    
    const result_id = await query(`SELECT id from categories where name = $1`,[category])
    const category_id= result_id.rows[0].id;
    const result = await query(`
      INSERT INTO posts 
        (title, slug, content, excerpt, category_id, cover_image, read_time) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [title, slug, content, excerpt,category_id, cover_image, read_time]);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
};

export const getAspecificPost = async (req, res) => {
  try {
    const { id } = req.params;
    
const result = await query(`
      SELECT p.*, c.name as category_name
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, category, cover_image, read_time } = req.body;
    console.log(req.body)
    // Check if post exists
    const postCheck = await query('SELECT * FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if new slug already exists (excluding current post)
    if (slug && slug !== postCheck.rows[0].slug) {
      const slugCheck = await query(
        'SELECT id FROM posts WHERE slug = $1 AND id != $2', 
        [slug, id]
      );
      
      if (slugCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'A post with this slug already exists'
        });
      }
    }

    const cat_id = await query (`select id from categories where name = $1`,[category])
    const category_id = cat_id.rows[0].id;
    const result = await query(`
      UPDATE posts 
      SET 
        title = COALESCE($1, title), 
        slug = COALESCE($2, slug), 
        content = COALESCE($3, content), 
        excerpt = COALESCE($4, excerpt), 
        category_id = COALESCE($5, category_id), 
        cover_image = COALESCE($6, cover_image), 
        read_time = COALESCE($7, read_time),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 
      RETURNING *
    `, [title, slug, content, excerpt, category_id, cover_image, read_time, id]);
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if post exists
    const postCheck = await query('SELECT * FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    await query('DELETE FROM posts WHERE id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
};