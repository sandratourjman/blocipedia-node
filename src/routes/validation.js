module.exports = {
  validateUsers(req, res, next) {
     if(req.method === "POST") {
       req.checkBody("username", "Must be at least 3 characters in length").isLength({min:3});
       req.checkBody('username', 'Username already in use. Please input a different username').isUsernameAvailable();

       req.checkBody("email", "Must be valid").isEmail();
       req.checkBody('email', 'Email already in use. Please input a different email').isEmailAvailable();

       req.checkBody("password", "Must be at least 6 characters in length").isLength({min: 6});
       req.checkBody("passwordConfirmation", "Must match password provided").optional().matches(req.body.password);
     }

     const errors = req.validationErrors();

     if (errors) {
       req.flash("error", errors);
       return res.redirect(req.headers.referer);
     } else {
       return next();
     }
  },


}