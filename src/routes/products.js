const router = require('express').Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const { cache, verifyCache } = require('./cache');
/**
 * @swagger
 * components:
 *  schemas:
 *    Products:
 *      type: object
 *      properties:
 *        category:
 *          type: integer
 *          description: number of category
 *        discount:
 *          type: integer
 *          description: discount applied to the product
 *        id:
 *          type: integer
 *          description: number of id
 *        name:
 *          type: integer
 *          description: searched product name
 *        price:
 *          type: integer
 *          description:  price of product
 *        url_image:
 *          type: string
 *          description: product image url
 */

/**
 * @swagger
 * /products:
 *  get:
 *    summary: list all products including pagination, search by name and filter by categories
 *    tags: [Products]
 *    parameters:
 *     -   name: page
 *         in: query
 *         description: number of page
 *         schema:
 *          type: integer
 *          default:  0
 *     -   name: category
 *         description: number of category
 *         in: query
 *         schema:
 *          type: integer
 *          minimum:  1
 *          maximum:  7
 *          default:  3
 *     -   name: name
 *         description: product name to search
 *         in: query
 *         schema:
 *          type: string
 *          default:  ron
 *    responses:
 *      200:
 *        description: list all products that match the sent parameters
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                totalPages:
 *                  type: integer
 *                  description: total number of pages according to the parameters sent
 *                content:
 *                  type: array
 *                  description:  array of objects with product data
 *                  items:
 *                    $ref: '#/components/schemas/Products'
 *
 */
router.get('/', verifyCache, async (req, res) => {
  /* const product = await Product.findAll(); */

  const pageAsNumber = Number.parseInt(req.query.page, 10);
  const limit = 12;

  let page = 0;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  try {
    const getProducts = async (query) => Product.findAndCountAll(query);

    const query = {
      attributes: ['id', 'name', 'url_image', 'price', 'discount', 'category'],
      limit,
      offset: page * limit,
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

    const response = {
      totalPages: Math.ceil(products.count / limit),
      content: products.rows,
    };

    cache.set(req.originalUrl, response);

    res.send(response);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
});

module.exports = router;
