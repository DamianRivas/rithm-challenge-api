const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

const controller = require("../controllers/users.controller");

router.route("/").get(controller.getUsers).all(methodNotAllowed);

module.exports = router;
