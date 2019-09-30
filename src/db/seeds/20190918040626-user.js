'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs"); 

const salt = bcrypt.genSaltSync(10);
const plainPassword = "123456";

let users = [];

for(let i = 1 ; i <= 20 ; i++){
 users.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync(plainPassword, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard",
 });
}

// admin user
users.push({
    username: "admin",
    email: "admin@example.com",
    password: bcrypt.hashSync(plainPassword, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "admin",
 });

// standard user 
users.push({
    username: "standard",
    email: "standard@example.com",
    password: bcrypt.hashSync(plainPassword, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard",
 });

//premium user
users.push({
    username: "premium",
    email: "premium@example.com",
    password: bcrypt.hashSync(plainPassword, salt),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "premium",
 });


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("Users", null, {});

  }
};
