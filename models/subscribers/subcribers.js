const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String, required: true, index: {
            unique: true
        },
        match: /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    // password: { type: String, required: true },
    phone: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    }
});
const Subscriber = mongoose.model("Subscriber", subSchema);

module.exports = Subscriber;