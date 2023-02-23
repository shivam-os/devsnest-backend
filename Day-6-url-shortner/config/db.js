const Sequelize = require("sequelize");

const sequelize = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

module.exports = sequelize;
