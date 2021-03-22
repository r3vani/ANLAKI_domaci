const mongoose = require("mongoose");

const nalog = new mongoose.Schema({
    email: 
    {
        type: String,
        trim: true,
        required: true,
    },
    username: 
    {
        type: String,
        trim: true,
        required: true,
    },
    password: 
    {
        type: String,
        trim: true,
        required: true,
    },
    ime: 
    {
        type: String,
        trim: true,
        required: true,
    },
    prezime: 
    {
        type: String,
        trim: true,
        required: true,
    }
});

module.exports = mongoose.model("account", nalog);