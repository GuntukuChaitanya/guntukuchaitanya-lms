const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

var userSchema= mongoose.Schema({
    dp :{
        data: Buffer,
        contentType: String,
    },
    firstname :{
        type: String,
        required: [true,"Enter your First Name"]
    },
    lastname :{
        type: String,
        required: [true,"Enter your Last Name"]
    },
    email :{
        type: String,
        required: [true,"Enter an Email id"],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter an valid email']
    },
    phone :{
        type: String,
        required: [true,"Enter your Contact Number"],
        unique: true,
    },
    gender :{
        type: String,
        required: [true,"Need to Specify Gender"],
    },
    city: {
        type: String,
        required: [true,"Need to provide location"],
    },
    country :{
        type: String,
        required: [true,"Need to provide location"],
    },
    course:{
        type: String,
        required:[true,"Select a Course"],
    },
    password :{
        type: String,
        required: [true,"Password is Complusory"],
        minlength: [8,"Minimum Password Length is 8 characters"]
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const Register = mongoose.model("User", userSchema);

module.exports = Register;