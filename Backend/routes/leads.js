const express = require('express');
const { Op } = require('sequelize');
const { Lead } = require('../models/Lead');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create lead
router.post('/', async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const lead = await Lead.create(leadData);
    res.status(201).json(lead);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Get all leads with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      source,
      min_score,
      max_score,
      is_qualified,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.id };

    // Add filters
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) whereClause.status = status;
    if (source) whereClause.source = source;
    if (is_qualified !== undefined) whereClause.is_qualified = is_qualified === 'true';
    
    if (min_score || max_score) {
      whereClause.score = {};
      if (min_score) whereClause.score[Op.gte] = parseInt(min_score);
      if (max_score) whereClause.score[Op.lte] = parseInt(max_score);
    }

    const { count, rows } = await Lead.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      data: rows,
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.update(req.body);
    res.json(lead);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;