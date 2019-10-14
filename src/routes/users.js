const express = require("express");
const router = express.Router();
const validation = require("./validation");
const passport = require("passport");
const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", validation.validateUsers, userController.create);

router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", passport.authenticate('local', {
        failureRedirect: '/users/sign_in',
        failureFlash: true
    }),userController.signIn);
router.get("/users/sign_out", userController.signOut);

router.get("/users/collaborations", userController.showCollaborations);
router.get("/users/:id", userController.show);

router.get("/users/:id/upgrade", userController.upgradeForm);
router.post("/users/:id/upgrade", userController.upgrade);
router.post("/users/:id/downgrade", userController.downgrade);




module.exports = router;