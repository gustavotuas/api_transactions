const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const routes = require("./routes/index");
const dbConnection = require("./config/mongoDB");
const errorHandler = require("./middleware/error");
const notFound = require("./middleware/notFound");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

const app = express();

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "production";

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

dbConnection();

app.use(express.json());

app.use(routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server listening in PORT:${PORT} and NODE_ENV:${NODE_ENV}..`.blue.inverse
  );
});
