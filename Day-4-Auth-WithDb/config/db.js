//Capital letter as it is a class
const Sequelize = require("sequelize");

//Create a database instance using following information
const sequelize = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

module.exports = sequelize;
