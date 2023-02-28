const express = require("express");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();
const PORT = 5000;

//To get the req.body
app.use(express.json());

//Connect to the database
connectDB();

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
