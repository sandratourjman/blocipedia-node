const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){
     let newUser = {
       username: req.body.username,
       email: req.body.email.toLowerCase(),
       password: req.body.password,
       passwordConfirmation: req.body.passwordConfirmation
     };
     userQueries.createUser(newUser, (err, user) => {
       if(err){
         // req.flash("error", err);
         req.flash("error", err.errors[0].message);
         res.redirect("/users/sign_up");
       } else {
         passport.authenticate("local")(req, res, () => {
           req.flash("notice", `Welcome to Bloccipedia, ${req.user.name}!`);
           res.redirect("/");
         })
       }
     });
   },
   
   signInForm(req, res, next){
     res.render("users/sign_in");
   },
   
   signIn(req, res, next){   
   console.log("userController line 36");
      console.log(req); 
     passport.authenticate("local")(req, res, function () {

       if(!req.user){
         req.flash("notice", "Sign in failed. Please try again.")
         res.redirect("/users/sign_in");
       } else {
         req.flash("notice", `Welcome back, ${req.user.username}!`);
         res.redirect("/");
       }
     })
   },

   signOut(req, res, next){
     req.logout();
     req.flash("notice", "You've successfully signed out!");
     res.redirect("/");
   },

   // show(req, res, next){
   //  userQueries.getUser(req.params.id, (err, result) => {

   //    if(err || result.user === undefined){
   //      req.flash("notice", "No user found with that ID.");
   //      res.redirect("/");
   //    } else {

   //      res.render("users/show", {...result});
   //    }
   //  });
}