const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //Library for using JWT
const router = express.Router();
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const User = require("../models/userModel");

//Signup api
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body; //Get data from req.body

    //Validate name, email & password
    if (!validateName(name)) {
      return res
        .status(400)
        .send(
          "Error: Name must be at least 3 character long and must not include numbers or special characters."
        );
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Error: Invalid email format.");
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .send(
          "Error: Password must be atleast 8 character long and it must include atleast - one uppercase letter, one lowercase letter, one digit, one special character."
        );
    }

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(403)
        .send(
          "Error: User with given email already exists. Recheck the typed email or try signing in."
        );
    }

    //Create a hash for the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      isSeller: isSeller
    });

    if (createdUser) {
      return res
        .status(201)
        .send(`Welcome, ${name}! Thanks for signing up with devsnest.`);
    }
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500);
  }
});

//Signin api
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if email & password fields are not empty
    if (email.length === 0 || password.length === 0) {
      return res.status(400).send("Error: Input fields cannot be empty.");
    }

    //Check if user exists or not
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res
        .status(404)
        .send(
          "Error: User with given email does not exist. Consider signing up instead or recheck the typed email."
        );
    }

    //Compare the entered password with the hashed password
    const enteredPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!enteredPassword) {
      return res
        .status(400)
        .send("Error: Invalid password. Please recheck and try again.");
    }

    //Payload is the data which we want to store in jwt
    const payload = {
      user: {
        id: existingUser.id,
      },
    };

    //It will expire in 1 hour
    const bearerToken = await jwt.sign(payload, "SECRET KEY", {
      expiresIn: "2h",
    });

    //This will store the jwt token in the form of key value pairs
    res.cookie("t", bearerToken); //It will expire once the session is over

    return res
      .status(200)
      .send(`Welcome back ${existingUser.name}. You are logged in now.`);
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500);
  }
});

//Signout api
router.post("/signout", (req, res) => {
  try {
    res.clearCookie("t"); //This will delete the cookie with key as "t"
    return res.status(200).send("You are logged out successfully.");
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500);
  }
});

module.exports = router;
