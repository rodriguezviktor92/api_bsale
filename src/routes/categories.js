const router = require('express').Router();

const Category = require('../models/Category');
const { cache, verifyCache } = require('./cache');

router.get('/', verifyCache, async (req, res) => {
  try {
    const categories = await Category.findAll();
    cache.set(req.originalUrl, categories);
    res.send(categories);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
});

module.exports = router;
