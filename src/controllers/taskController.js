const Task = require("../models/task");

exports.editTask = async (req, res) => {
    try {
        const _id = req.params.id;
        const userId = req.user._id;
        const allowedUpdates = ["title", "description", "completed", "date"];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({
                error:
                    "Only 'title', 'description', 'completed', and 'date' fields are allowed.",
            });
        }

        const task = await Task.findOne({ _id, user: userId });

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        Object.assign(task, req.body);
        await task.save();
        res.redirect("/list");
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).send();
        }
        await task.deleteOne();
        res.redirect("/list");
    } catch (error) {
        res.status(500).send({ error: "Server error", details: error.message });
    }
};

exports.getEditPage = async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findById(_id).lean();
        if (!task) {
            res.status(404).send();
        }
        task.dateFormatted = new Date(task.date).toISOString().split("T")[0];
        res.render("edit", {
            title: "Edit Task",
            task,
            username: req.user.name,
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.addTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id,
    });
    await task.save();
    res.redirect("/list");
};

exports.getTaskListPage = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id }).lean();
    const taskList = tasks.map((task) => ({
        ...task,
        formattedDate: task.date ? task.date.toISOString().split("T")[0] : "",
    }));
    res.render("list", {
        title: "Your Tasks",
        taskList,
        username: req.user.name,
    });
};

exports.getAddTaskPage = (req, res) => {
    res.render("add", {
        title: "Add a New Task",
        username: req.user.name,
    });
};
