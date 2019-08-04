const express = require("express");
Action = require("./helpers/actionModel");
actionId = require("./project-router");
Project = require("./helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  Action.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({
        err: "The action information cannot be retrueved",
        message: err.message
      });
    });
});

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.delete("/:id", validateActionId, (req, res) => {
  const { id } = req.params;

  Action.remove(id)
    .then(action => {
      if (action) {
        res.status(200).json({ message: "The action was deleted" });
      } else {
        res.status(404).json({
          message: "The action with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The action could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    res
      .status(400)
      .json({ errorMessage: "Please provide description to action." });
  } else {
    Action.update(id, req.body)
      .then(action => {
        if (action) {
          res.status(200).json(action);
        } else {
          res.status(404).json({
            message: "The action with the specified ID does not exist"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "The action information count not be modified"
        });
      });
  }
});

router.post("/", validateAction, (req, res) => {
  Action.insert(req.body)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

// custom middleware

async function validateActionId(req, res, next) {
  try {
    const { id } = req.params;
    const action = await Action.get(id);
    if (action) {
      req.action = action;
      next();
    } else {
      next({
        status: 404,
        message: "The action with the specified ID does not exist."
      });
    }
  } catch {
    next({
      status: 500,
      message: "The action information could not be retrieved."
    });
  }
}

function validateAction(req, res, next) {
  const action = req.body;

  if (action.description && action.notes) {
    next();
    if (!action.project_id) {
      res.status(400).json({ message: "project_id must be existing" });
      next();
    }
  } else {
    res
      .status(400)
      .json({ message: "project_id, description, or notes are missing" });
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
