const express = require("express");
const bcrypt = require("bcrypt"); //3rd party library to encrypt the password before saving to database
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const router = express.Router();

let userData = {}; //Database
/*
Example of a single entry:
userData = {
  "example.com": {
    name: "example",
    password: "hashedPassword"
  }
}
 */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; //Get name, email & password from req.body

    const userExists = userData.hasOwnProperty(email); //Returns true if email matches with database

    if (userExists) {
      return res
        .status(403)
        .send(
          "User already exists. Try login or sign up with different information."
        );
    }

    if (!validateName(name)) {
      return res
        .status(400)
        .send(
          "Error: Invalid user name: Name must be longer than 2 characters & must not include any numbers or special characters."
        );
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Error: Invalid email.");
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .send(
          "Error: Invalid password: Password must be atleast 8 characters long & must include- one uppercase letter, one lowercase letter, one special character, one digit."
        );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    userData[email] = { name: name, password: encryptedPassword }; //Save user to database with encrypted password

    return res
      .status(201)
      .send(`Welcome to Devsnest, ${name}! Thanks for signing up.`);
  } catch (err) {
    console.log(err);
    return res.status(500).send(`Error: ${err.message}`); //Send the error message
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body; //Get email & password from req.body

    if (email.length === 0) {
      return res.status(400).send("Error: Please enter your email."); //Check if email field is empty
    }

    if (password.length === 0) {
      return res.status(400).send("Error: Please enter your password."); //Check if password field is empty
    }

    const userExists = userData.hasOwnProperty(email);
    if (!userExists) {
      return res
        .status(404)
        .send("Error: User not found. Check email again or signup."); //Check if email exists in database
    }

    const passwordMatched = await bcrypt.compare(
      password,
      userData[email].password
    ); //Compare the entered and stored password
    if (!passwordMatched) {
      return res
        .status(403)
        .send("Error: Incorrect password. Please try again.");
    }

    return res
      .status(200)
      .send(`Welcome to Devsnest ${userData[email].name}. You are logged in.`);
  } catch (err) {
    console.log(err);
    return res.send(`Error: ${err.message}`);
  }
});

module.exports = router;
