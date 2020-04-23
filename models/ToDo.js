const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: false
    },
    deadline: {
        type: Date,
        required: true,
        default: Date.now
    },
    start: {
        type: Date,
        required: true,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ToDo", toDoSchema, 'todo');