const dotenv = require("dotenv");
const swaggerAutogen = require("swagger-autogen")();

dotenv.config({ path: "./config/config.env" });

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;

const doc = {
  info: {
    title: "API",
    description: "Transaction API documentation generated with swagger-autogen",
    version: "1.0.0",
  },
  host: `${host}:${port}`,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
