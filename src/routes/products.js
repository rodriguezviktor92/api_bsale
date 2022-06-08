const router = require('express').Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  /* const product = await Product.findAll(); */

  const pageAsNumber = Number.parseInt(req.query.page, 10);

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  const getProducts = async (query) => Product.findAndCountAll(query);

  const query = {
    attributes: [
      'id',
      'name',
      'url_image',
      'price',
      'discount',
      'category',
    ],
    limit: 3,
    offset: page * 3,
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

  res.send({
    totalPages: Math.ceil(products.count / 3),
    content: products.rows,
  });

/*   res.send(product); */
});

router.get('/:id', (req, res) => {
  res.send('hola');
});

module.exports = router;
