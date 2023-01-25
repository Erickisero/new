const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    firstname:{
        type: String,
        required:[true, 'First name is required']
    },
    lastname:{
        type: String,
        required:[true,'Lastname is required']
    },
    gender:{
        type: String
    }
});
//model that is going to represent our collection in the db.
const Student = mongoose.model('student', studentSchema);
//exporting this file so as to use it in other files
module.exports = Student;
