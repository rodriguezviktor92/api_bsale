const express = require('express');
const cors = require('cors');
const products = require('./routes/products');
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

app.use(express.json());
app.use(cors());

app.use('/products', products);

app.listen(port, () => {
  console.log('Runing in port:', port);
});
