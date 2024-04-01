const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

dotenv.config({ path: "./.env" });

const app = express();

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoute"));
app.use("/project", require("./routes/projectRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/status", require("./routes/statusRoute"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
