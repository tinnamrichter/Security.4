const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
});



userSchema.methods.getFullName = function () {
    return `Name: ${this.firstName} ${this.lastName}`;
}

userSchema.methods.getInfo = function () {
    return `${this.getFullName()}, Email: ${this.email}, Zipcode: ${this.zipcode}`;
}

userSchema.methods.getCredentials = function () {
    return `${this.email}\t${this.password}`;
}

module.exports = mongoose.model("User", userSchema, 'user');
