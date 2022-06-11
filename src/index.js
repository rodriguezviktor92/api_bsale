const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const products = require('./routes/products');
const categories = require('./routes/categories');

const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bsale',
      version: '1.0.0',
    },
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`],
};

const db = require('./db/db');

const app = express();
const port = process.env.PORT || 3001;

(async () => {
  try {
    await db.authenticate();
    await db.sync({ force: false });

    console.log('conectado a la db');
  } catch (error) {
    throw new Error(error);
  }
})();

//  middleware
app.use(express.json());
app.use(cors());

// prettier-ignore
app.use(
  '/api-doc',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec)),
);

app.use('/products', products);
app.use('/categories', categories);

app.listen(port, () => {
  console.log('Runing in port:', port);
});
