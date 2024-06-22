const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"],
    },
    email: {
        type: String,
        required: [true, "A user must have an email"],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, "Already existed email"]
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "A user must have a password"],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, "not confirmed password"],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;