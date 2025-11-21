const { Schema } = require("mongoose");

const UsersSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }

});

module.exports = {UsersSchema};