const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const taskValidator = require('../validators/task.validator');
const tasksController = require('../controllers/tasks.controller');
const auth = require("../middlewares/auth.middleware");

router.use(auth);

router.get('/', tasksController.getAllTasks);
router.post(
    '/',
    validate(taskValidator.createTaskSchema),
    tasksController.createTask
);
router.put(
    '/:id',
    validate(taskValidator.updateTaskSchema),
    tasksController.updateTask
);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
