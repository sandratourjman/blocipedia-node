const express = require("express");
const router = express.Router();
const expressValidator = require('express-validator');
const validation = require("./validation");

const userController = require("../controllers/userController");

router.use(expressValidator({
    customValidators: {
      isUsernameAvailable(username) {
        return new Promise((resolve, reject) => {
          User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if(user == null) {
              resolve();
            } else {
              reject();
            }
          });
        });
      },
      isEmailAvailable(email) {
        return new Promise((resolve, reject) => {
          User.findOne({ email: email }, (err, user) => {
            if (err) throw err;
            if(user == null) {
              resolve();
            } else {
              reject();
            }
          });
        });
      }

    }
  })
);

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", validation.validateUsers, userController.create);

// router.post("/users/sign_up", validation.validateUsers, userController.create);

// router.post("/users", validation.validateUsers, userController.create);
// router.get("/users/sign_in", userController.signInForm);
// router.post("/users/sign_in", validation.validateUsers, userController.signIn);
// router.get("/users/sign_out", userController.signOut);
// router.get("/users/:id", userController.show);

module.exports = router;