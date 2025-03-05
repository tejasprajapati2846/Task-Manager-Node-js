const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

router.post("/edit-task/:id", auth, taskController.editTask);

router.post("/tasks/delete/:id", auth, taskController.deleteTask);

router.get("/edit/:id", auth, taskController.getEditPage);

router.post("/add-task", auth, taskController.addTask);

router.get("/list", auth, taskController.getTaskListPage);

router.get("/add", auth, taskController.getAddTaskPage);

module.exports = router;