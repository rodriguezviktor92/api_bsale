const router = require('express').Router();

const Category = require('../models/Category');
const { cache, verifyCache } = require('./cache');

router.get('/', verifyCache, async (req, res) => {
  const categories = await Category.findAll();
  cache.set('categories', categories);
  res.send(categories);
});

module.exports = router;
