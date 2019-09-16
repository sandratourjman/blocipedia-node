const User = require("./models").User;
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
      // console.log(user);
      const msg = {
        to: user.email,
        from: 'sandratourjman@gmail.com',
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
  
  getUser(id, callback){
  	let result = {};
    User.findByPk(id)
    .then((user) => {
    	if(!user) {
        	callback(404);
      	} else {
      		result["user"] = user;
    	}
  	});
  }
 
}