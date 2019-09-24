const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const secretKey = process.env.STRIPE_SECRET_KEY;
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe = require("stripe")(secretKey);


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
           req.flash("notice", "You've successfully signed up. Welcome!");
           res.redirect("/");
         })
       }
     });
   },
   
   signInForm(req, res, next){
     res.render("users/sign_in");
   },
   
   signIn(req, res, next){   
     passport.authenticate("local")(req, res, function () {
       if(!req.user){
         req.flash("notice", "Sign in failed. Please try again.")
         res.redirect("/users/sign_in");
       } else {
         req.flash("notice", `Welcome back, ${req.user.username}!`);
         res.redirect("/");
       }
     });

   },
   signOut(req, res, next){
     req.logout();
     req.flash("notice", "You've successfully signed out!");
     res.redirect("/");
   },

   show(req, res, next) {
    res.render("users/show");
   },

   // change to secret key in production
   upgradeForm(req, res, next) {
    res.render("users/upgrade", {publishableKey});
   },

   upgrade(req, res, next) {
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then((customer) => {
      stripe.charges.create({
        amount: 1500,
        currency: "usd",
        customer: customer.id,
        description: "Premium membership"
      })
    })
    .then((charge) => {
      userQueries.upgradeUser(req.user.dataValues.id);
      res.render("users/upgrade_success");
    })

   },

   downgrade(req, res, next) {
    userQueries.downgradeUser(req.user.dataValues.id);
    req.flash("notice", "You've successfully downgraded your account.");
    res.redirect("/users/:id");

   }

   
}