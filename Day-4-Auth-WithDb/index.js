const express = require("express");
const routes = require("./routes/authRoutes");
const app = express();
const PORT = 5000;

//To use the req.body
app.use(express.json());

//To view htmls files in public folder
app.use(express.static("public"));

//To use the routes
app.use("/api/v1/", routes);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
