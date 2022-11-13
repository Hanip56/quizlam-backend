require("dotenv").config();
require("colors");
const path = require("path");
const express = require("express");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/group-code", require("./routes/groupCodeRoutes"));

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server is listening on port:${PORT}`.yellow.bold)
);
