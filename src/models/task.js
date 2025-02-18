const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
});

module.exports = Task;
