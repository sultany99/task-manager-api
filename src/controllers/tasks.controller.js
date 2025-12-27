const Task = require("../models/Task");

const { buildFilterFromDomain } = require("../utils/buildFilterDomain");


exports.getAllTasks = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10, domain } = req.query;



        // Build filter dynamically
        let filter = {};

        if (domain) {
            const parsedDomain = JSON.parse(domain);
            console.log('Parsed Domain:', parsedDomain);
            filter = buildFilterFromDomain(parsedDomain);
            console.log('Built Filter:', filter);
        }

        if (status) filter.completed = status === 'true';

        filter.user = req.user._id;



        // Pagination
        const skip = (page - 1) * limit;
        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Task.countDocuments(filter);

        res.json({
            page: Number(page),
            total,
            tasks,
        });
    } catch (error) {
        next(error);
    }
};


exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            user: req.user._id,
        });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};


exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!task) {
            const error = new Error('Task not found');
            error.status = 404;
            throw error;
        }

        res.json(task);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user._id,
        });

        if (!task) {
            const error = new Error('Task not found');
            error.status = 404;
            throw error;
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

