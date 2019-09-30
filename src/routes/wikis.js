const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.index);
router.get('/wikis/private', wikiController.privateWiki);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", 
	validation.validateWikis,
	helper.ensureAuthenticated, 
	wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", 
	validation.validateWikis,
	wikiController.edit);
router.post("/wikis/:id/update", wikiController.update);


module.exports = router;
