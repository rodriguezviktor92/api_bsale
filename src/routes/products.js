const router = require('express').Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const { cache, verifyCache } = require('./cache');

router.get('/', verifyCache, async (req, res) => {
  /* const product = await Product.findAll(); */

  const pageAsNumber = Number.parseInt(req.query.page, 10);
  const limit = 12;

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  const getProducts = async (query) => Product.findAndCountAll(query);

  const query = {
    attributes: ['id', 'name', 'url_image', 'price', 'discount', 'category'],
    limit,
    offset: page * limit,
    /*     include: [
      {
        model: Category,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    ], */
  };

  if (req.query.category && req.query.category !== '0') {
    const { category } = req.query;

    query.where = {
      category,
    };
  }

  if (req.query.name) {
    const { name } = req.query;

    if (query.where) {
      query.where.name = {
        [Op.like]: `%${name.toLowerCase()}%`,
      };
    } else {
      query.where = {
        name: {
          [Op.like]: `%${name.toLowerCase()}%`,
        },
      };
    }
  }

  const products = await getProducts(query);

  console.log(req.originalUrl);

  const response = {
    totalPages: Math.ceil(products.count / limit),
    content: products.rows,
  };

  cache.set(req.originalUrl, response);

  res.send(response);

  /*   res.send(product); */
});

router.get('/:id', (req, res) => {
  res.send('hola');
});

module.exports = router;
