// importing required modules ('mongoose')
const mongoose = require('mongoose')

// Create a Schema instance
const Schema = mongoose.Schema;

// Define the Schema object
const TodoSchema = new Schema({
    // this schema contains 3 datatypes 
    // text to store the todo statement
    // complete to store the status of the todo (completed or not)
    // timestamp to store the time of uploading of todo
    text: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: String,
        default: Date.now()
    }
})


// named exporting of the schema
const Todo = mongoose.model("Todo",TodoSchema);
module.exports = Todo;