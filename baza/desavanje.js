const mongoose = require("mongoose");

const desavanje = new mongoose.Schema({
    naziv: 
    {
        type: String,
        trim: true,
        required: true,
    },
    vreme: 
    {
        type: String,
        trim: true,
        required: true,
    },
    mesto: 
    {
        type: String,
        trim: true,
        required: true,
    },
    opis: 
    {
        type: String,
        trim: true,
        required: true,
    },
    idKreatora: 
    {
        type: String,
        trim: true,
        required: true,
    }
});

module.exports = mongoose.model("desavanje", desavanje);