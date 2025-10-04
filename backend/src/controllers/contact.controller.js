// controllers/contact.controller.js
import { query } from "../utils/db.js"

export const contactInfo = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Insert into database
    const result = await query(
      `INSERT INTO contact_submissions (name, email, subject, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [limit, offset];

    if (status && status !== 'all') {
      whereClause = 'WHERE status = $3';
      queryParams.push(status);
    }

    const result = await query(
      `SELECT * FROM contact_submissions 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      queryParams
    );

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(*) FROM contact_submissions ${whereClause}`,
      status && status !== 'all' ? [status] : []
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, read, replied, archived'
      });
    }

    const result = await query(
      `UPDATE contact_submissions 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM contact_submissions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getContactStats = async (req, res) => {
  try {
    // Get counts for each status
    const statsResult = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM contact_submissions 
      GROUP BY status
    `);

    // Get total count
    const totalResult = await query('SELECT COUNT(*) FROM contact_submissions');
    const total = parseInt(totalResult.rows[0].count);

    // Get unread count (pending status)
    const unreadResult = await query(
      'SELECT COUNT(*) FROM contact_submissions WHERE status = $1',
      ['pending']
    );
    const unread = parseInt(unreadResult.rows[0].count);

    // Format stats
    const stats = {
      total,
      unread,
      byStatus: {}
    };

    statsResult.rows.forEach(row => {
      stats.byStatus[row.status] = parseInt(row.count);
    });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}