const express = require("express");
Project = require("./helpers/projectModel");

const router = express.Router();

router.post("/", validateProject, (req, res) => {
  Project.insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/", (req, res) => {
  Project.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({
        err: "The project information cannot be retrueved",
        message: err.message
      });
    });
});

function validateProject(req, res, next) {
  const project = req.body;

  if (project.name && project.description) {
    next();
  } else {
    res.status(400).json({ message: "Name or description is needed" });
  }
}

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      next({
        status: 404,
        message: "The project with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The project information could not be retrieved."
    });
  }
}

module.exports = router;
