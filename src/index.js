const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/routes");

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 3030;

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running -> http://localhost:${PORT}`);
});

module.exports = app;
