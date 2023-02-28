const Sequelize = require("sequelize"); //ORM for working with database

//Initialize the database using required information
const sequelize = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite"
});

const connectDB = async () => {
  try {
    await sequelize.sync();
    console.log("Successfully connect to the database.")
  } catch(err) {
    console.log("Couldn't connect to the database due to: ", err);
  }
}

module.exports = {sequelize, connectDB};
