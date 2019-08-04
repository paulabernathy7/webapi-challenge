const express = require("express");
const actionRouter = require("./data/action-router"); //importing
const projectRouter = require("./data/project-router");
const helmet = require("helmet");

const server = express(); // other req parsers are available, this is also called middleware
server.use(express.json());
server.use("/api/actions", logger, actionRouter);
server.use("/api/projects", logger, projectRouter);
server.use(helmet());

//base URL
server.get("/", (req, res, next) => {
  res.send({ success: "We're ready" });

  next();
});

function logger(req, res, next) {
  const date = new Date();
  const method = req.method;
  const url = req.url;
  console.log(`${date}, ${method}, ${url} it works!`);
  next();
}
module.exports = server;
