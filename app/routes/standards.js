var express = require("express");
var router = express.Router();
var standardsController = require("../controllers/standards");
var performancesController = require("../controllers/performances");

router.get("/", standardsController.multiple);
router.get("/:standard_id", standardsController.single);
router.get("/:standard_id/performances", performancesController.byStandard);

module.exports = router;
