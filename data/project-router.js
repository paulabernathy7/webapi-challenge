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

router.post("/:id", validateProject, (req, res) => {
  const project = req.body;

  Project.insert(project)
    .then(project => {
      if (project) {
        res.status(201).json(project);
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide name or description." });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "There was an error while saving",
        err: err.message
      });
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

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.delete("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;

  Project.remove(id)
    .then(action => {
      if (action) {
        res.status(200).json({ message: "The project was deleted" });
      } else {
        res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be removed" });
    });
});

router.put("/:id", validateProjectId, validateProject, async (req, res) => {
  const project = await Project.update(req.params.id, req.body);
  if (project) {
    res.status(200).json(project);
  } else {
    res
      .status(500)
      .json({ message: "The action information could not be updated." });
  }
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
      res
        .status(404)
        .json({ message: "The project with the specified id does not exist" });
    }
  } catch {
    res
      .status(500)
      .json({ message: "The project information could not be retrieved." });
  }
}

module.exports = router;
