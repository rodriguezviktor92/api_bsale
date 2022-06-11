const router = require('express').Router();

const Category = require('../models/Category');
const { cache, verifyCache } = require('./cache');

/**
 * @swagger
 * components:
 *  schemas:
 *    Categories:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: number of id
 *        name:
 *          type: integer
 *          description: category name
 */

/**
 * @swagger
 * /categories:
 *  get:
 *    summary: list all categories
 *    tags: [Categories]
 *    responses:
 *      200:
 *        description: list all categories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              description:  array of objects with product data
 *              items:
 *               $ref: '#/components/schemas/Categories'
 *
 */

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
