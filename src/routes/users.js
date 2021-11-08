const router = require("express").Router();

router.route("/").get(function (req, res, next) {
  const { query } = req;
  if (query.dist) {
    query.dist = Number(query.dist);
  }
  if (query.min_age) {
    query.min_age = Number(query.min_age);
  }
  if (query.max_age) {
    query.max_age = Number(query.max_age);
  }

  res.json({
    metadata: { path: req.baseUrl, query },
    results: "Nothing here yet",
  });
});

module.exports = router;
