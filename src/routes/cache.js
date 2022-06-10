const NodeCache = require('node-cache');

const cache = new NodeCache();

const verifyCache = (req, res, next) => {
  try {
    if (cache.has(req.originalUrl)) {
      return res.json(cache.get(req.originalUrl));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  cache,
  verifyCache,
};
