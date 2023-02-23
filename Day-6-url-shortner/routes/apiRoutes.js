const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid"); //3rd party library to create unique short ids
const sequelize = require("../config/db");
const Url = require("../models/urlModel"); //Url model for inserting data into table
const baseUrl = "http://localhost:5000/urlapi/";

//Create the database
const createDb = async () => {
  try {
    await sequelize.sync();
    console.log("DB is running.");
  } catch (err) {
    console.log(err);
  }
};

createDb();

//POST
router.post("/", async (req, res) => {
  try {
    const { longUrl } = req.body; //Get longUrl from the req body
    const shortId = nanoid(4); //Create a 4 characters long unique id

    //Insert the long url with corresponding unique short Id
    const storeUrl = await Url.create({
      longUrl: longUrl,
      shortUrl: shortId,
    });

    //Send response if success
    return res.status(201).json({
      status: "ok",
      shortUrl: `${baseUrl}${shortId}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

//GET
router.get("/:short", async (req, res) => {
  try {
    const shortId = req.params.short; //Get the shortId from url

    //Find the stored url data
    const storedUrl = await Url.findOne({
      where: {
        shortUrl: shortId,
      },
    });

    //If data not found
    if (!storedUrl) {
      return res.status(404).send("Error: Url not found.");
    }

    //Redirect to longUrl if found
    return res.redirect(storedUrl.longUrl);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
