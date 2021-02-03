module.exports = function asyncMiddleware(handler) {
  return (req, res, next) => {
    try {
      handler(req, es);
    } catch (ex) {
      next(ex);
    }
  };
};
