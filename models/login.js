const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycrypt = require('bcrypt');
const loginSchema = new Schema({
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique: true
    },
    password:{
        type: String,
        required:true
    }
    
});
//model that is going to represent our collection in the db.
//const login = mongoose.model('login', loginSchema);//exporting this file so as to use it in other files
// hashing password
loginSchema.pre('save', async function(next){
    try{
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }catch (error){
        next(error);
    }
});
//comparing password entered to one in db
loginSchema.methods.isValidPassword = async function(password){
    try{
        return await bycrypt.compare(password, this.password);
    }catch(error){
        throw error;
    }
}
const login = mongoose.model('login',loginSchema)

module.exports = login;

