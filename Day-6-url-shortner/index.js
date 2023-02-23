const express = require("express");
const routes = require("./routes/apiRoutes");
const app = express();
const PORT = 5000;

//For html files in public folder
app.use(express.static("public"));

//To get the req.body
app.use(express.json());

app.use("/urlapi", routes);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
})
