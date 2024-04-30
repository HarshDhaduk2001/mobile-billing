const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const cors = require("cors");
require("./models/permissionModel");
require("./models/permissionActionModel");
require("./models/permissionActionMapping");

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
app.use(cors());

// Routes
app.use("/auth", require("./routes/userRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/status", require("./routes/statusRoute"));
app.use("/organization", require("./routes/organizationRoute"));
app.use("/role", require("./routes/roleRoute"));
app.use("/permission", require("./routes/permissionRoute"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
