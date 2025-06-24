const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: String,
    department: String,
    yop: String,
    collegename: String,
});

module.exports = mongoose.model('Profile', profileSchema);
