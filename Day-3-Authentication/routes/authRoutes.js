const express = require("express");
const bcrypt = require("bcrypt");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const router = express.Router();

let userData = {
  email: {
    name: "name",
    password: "password",
  },
};

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (userData.hasOwnProperty[email] === true) {
    res.send("User already exists!");
  } else {
    if (!validateName) {
      res.send("Invalid name!");
    } else if (!validateEmail) {
      res.send("Invalid email!");
    } else if (!validatePassword) {
      res.send("Invalid password!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    userData[email] = { name: name, password: encryptedPassword };
    console.log(userData);
  }
  res.send("This is working");
});

module.exports = router;
