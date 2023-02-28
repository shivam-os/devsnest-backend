const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; //Get the authorization header data
    if (!authHeader) {
      return res.status(401).json({
        err: "Authorizaion header not found.",
      });
    }

    const token = authHeader.split(" ")[1]; //Get the jwt from the authorization header

    //If token not found
    if (!token) {
      return res.status(401).json({
        err: "Token not found in the header.",
      });
    }

    const decoded = jwt.verify(token, "SECRET KEY"); //Verify the token if found

    //Get the user from the database from decoded id
    const existingUser = await User.findOne({
      where: {
        id: decoded.user.id,
      },
    });

    //If user not found in the database
    if (!existingUser) {
      return res.status(404).json({
        err: "User not found.",
      });
    }

    //If user is found, then move to next middleware
    req.user = existingUser; //Create a user object in req object to be used by next middleware. This will also reduce the no. of database calls
    console.log(req.user)
    next();
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500);
  }
};

const isSeller = async (req, res, next) => {
  try {
    //Get the isSeller value from req.user which we created in previous middleware & check
    if (req.user.dataValues.isSeller) {
      next();
    } else {
      return res.status(401).json({
        err: "You are not a seller.",
      });
    }
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500);
  }
};

module.exports = { isAuthenticated, isSeller };
