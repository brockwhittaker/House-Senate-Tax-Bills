const express = require("express");
const app = express();

const API = require("./app/api");
const api = new API();

const bodyParser = require("body-parser");

const ENV = process.env.env;

const PORT = ENV === "PROD" ? 80 : 3000;

const minify = require("./app/minify");

// adds compression middleware.
require("./app/compression")(app);

app.use(bodyParser.json({ limit: "1mb" }));
app.set("view engine", "pug");

// make `/static/*` => `*` display statically.
app.use(express.static('static'));

// add routes for express.
require("./routes")(app, api);

minify.js();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

process.on('unhandledRejection', r => console.log(r));
