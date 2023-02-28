const multer = require("multer");
const path = require("path");

//Storage engine
const storage = multer.diskStorage({
  //Define where the files will be stored
  destination: (req, file, cb) => {
    cb(null, "content");
  },

  //Define the file names
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
});

//Initialize the upload
const upload = multer({
  storage,

  //Define the maximum file size in bytes
  limits: { fileSize: 10_000_000 }, //10 MB,

  //Define which files to be stored
  fileFilter: (req, file, cb) => {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|mp4/;
    //Check if file extension matches with allowed ones
    const extname = fileTypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    //Check if MIME type matches with the allowed ones
    const mimeType = fileTypes.test(file.mimetype);

    //If both are true then, upload the file else return error
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb("Error: Only Images or mp4 videos are supported.");
    }
  },
}).single("content"); //Here, the name attribute of the input from html is put;

module.exports = upload;
