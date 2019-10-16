const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
    	username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: user.email,
        from: 'noreply@blocipedia.com',
        subject: 'Welcome to Blocipedia!',
        text: 'You are now part of our wiki community!',
        html: `<strong>Welcome, ${user.username}</strong>`,
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    })
  },

  getAllUsers(callback){
    let result = {};
    return User.findAll()
    .then(users => {
      result['users'] = users;
      callback(null, result);
    })
    .catch(err => {
      callback(err);
    });
  },
  
  getUser(id, callback){
  	let result = {};
    User.findByPk(id)
    .then((user) => {
    	if(!user) {
        	callback(404);
      	} else {

      		result["user"] = user;

          Wiki.scope({ method: ["allWikis", id]}).findAll()
          .then((wikis) => {

            result["wikis"] = wikis;

            Collaborator.scope({ method: ['collaborationsFor', id] }).findAll()
            .then(collaborations => {

              result['collaborations'] = collaborations;
              callback(null, result);
            })

          })
          .catch(err => {
            callback(err);
          });
      }
    });
  },

  upgradeUser(id, callback) {
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback(404);
      } else {
        return user.updateAttributes({ role: "premium"})
      }
    })
    .catch((err) => {
      callback(err);
    });
  },

  downgradeUser(id, callback) {
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback(404);
      } else {
        return user.updateAttributes({ role: "standard"})
      }
    })
    .catch((err) => {
      callback(err);
    });
  }
 
}