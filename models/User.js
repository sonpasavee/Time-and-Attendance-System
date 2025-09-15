const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    name: {
        type: String , 
        required: true
    } ,
    email: {
        type: String , 
        required: [true , 'Please provide email'] ,
        unique: true
    } ,
    password: {
        type: String ,
        required: [true , 'Please provide password']
    } ,
    role: {
        type: String , 
        enum: ['employee' , 'admin'] , 
        default: 'employee'
    }
} , {timestamps:true})

UserSchema.pre('save' , function(next) {
    const user = this

    bcrypt.hash(user.password , 10).then(hash => {
        user.password = hash
        next()
    }).catch(error => {
        console.error(error)
    })
})

const User = mongoose.model('User' , UserSchema)
module.exports = User

