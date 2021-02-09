module.exports = function (req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send({
      error: { error: 403, message: "Forbidden - User is not admin" },
    });

  next();
};
