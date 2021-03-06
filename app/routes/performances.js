var express = require("express");
var router = express.Router();
var controller = require("../controllers/performances");

router.get("/", controller.multiple);
router.get("/:performance_id", controller.single);

module.exports = router;
