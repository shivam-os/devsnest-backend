const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload");
const {isAuthenticated, isSeller} = require("../middlewares/auth");

//POST Method
router.post("/create", isAuthenticated, isSeller, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err);
    }

    const {name, price} = req.body; //Get name, price from req.body

    //Check whether name, price or file are missing
    if (!name || !price || !req.file) {
      return res.status(400).json({
        err: "Recheck the data. Name, price or file are missing."
      })
    }

    //Check if price is a number
    if (Number.isNaN(price)) {
      return res.status(400).json({
        err: "Price should be a number."
      })
    }

    let productDetails = {
      name, price, content: req.file.path
    }

    return res.status(200).json({
      status: "ok",
      productDetails
    })

  })
})


module.exports = router;
