const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
            username : {
                type : String,
                required : true,
               unique : true,
            },
            password : {
                type : String,
                required : true,
            },
            email : {
                type : String,
                required : true,
                unique : true,
            },
 })

 const user = mongoose.model('User',userSchema);

 module.exports = user;