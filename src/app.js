const express = require('express');
const tasksRouter = require('./routes/tasks.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const userRouter = require("./routes/auth.routes");

const app = express();

// Parse JSON requests
app.use(express.json());

// Routes
app.use('/tasks', tasksRouter);
app.use("/auth", userRouter);


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
