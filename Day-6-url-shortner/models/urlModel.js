const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Url = sequelize.define("urls", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  longUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Url;
