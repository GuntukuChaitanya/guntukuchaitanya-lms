const Register = require("../models/userRegisters");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//Error Handling
const errorHandling =(err) =>{
    console.log(err.message, err.code);
    let errors={
        firstname : '',
        lastname : '' ,
        email : '',
        phone : '',
        gender : '',
        city : '' ,
        country : '',
        password : '',
    }


    //Validation Errors
    if(err.message.includes('User validation failed')){
       Object.values(err.errors).forEach(({properties}) =>{
           errors[properties.path]=properties.message;
       });
    }

    //Duplicates in DB
    if(err.code == 11000){
        errors.email='Email already registered.';
        return errors;
    }

    return errors;
}

const maxAge=3*24*60*60;


const createToken = (id) =>{
    return jwt.sign({id},'yourlearningmanagementsystem',{
        expiresIn: maxAge
    });
}


module.exports.getRegister=(req,res) =>{
    res.render('register')
}

module.exports.getLogin=(req,res) =>{
    res.render('login')
}


module.exports.postRegister = async (req,res) => {
    if(req.file==undefined){res.status(400).send("Insert DP")}
    else{var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    console.log(img);
    console.log(req.file.path);
    var final_dp={
        contentType:req.file.mimetype,
        dp:encode_img,
        data: img,
    }}
    if(req.body.fPass == req.body.sPass){
                console.log("Passwords Match");
                var obj = {
                    dp: final_dp,
                    firstname : req.body.fName,
                    lastname : req.body.lName,
                    email : req.body.mail,
                    phone : req.body.phno,
                    gender : req.body.gender,
                    city : req.body.city,
                    country : req.body.country,
                    course: req.body.course,
                    password : req.body.fPass,
                }
            }
    else{
        res.send("Passwords Didn't match.")
    }
    try {
        const registerUser = await Register.create(obj);
        const token = createToken(registerUser._id);
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        console.log("Saved To database");
        res.redirect('login');
    } catch (e) {
        const errors=errorHandling(e);
        res.status(400).json({errors});
    }
} 

module.exports.postLogin= async (req,res) =>{
        try {
        var lmail=req.body.uEmail;
        var lpass=req.body.uPass;
        // console.log(lmail+" with password: "+lpass+" entered on login form");

        const userEmail=await Register.findOne({email: lmail});
        console.log('Email Matched',userEmail);
        
        if(userEmail){
            console.log('Password');
            const auth_pass = await bcrypt.compare(lpass,userEmail.password);
            // console.log(auth_pass);
            if(auth_pass){
                console.log('Logged in');
                const token = createToken(userEmail._id);
                res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
                // res.render('dashboard');
                res.redirect('dashboard');
            }else{
                res.send("Invalid Password");
            }
        }else{
            res.send("Invalid eMail ID");
        }
        } catch (e) {
        console.log(e);
    }
}


module.exports.getDashboard = (req,res) =>{
    res.render('dashboard');
}


module.exports.getLogout =(req,res) =>{
    res.cookie('jwt','',{maxAge:1});
    res.render('index');
}

module.exports.getMyCourse = (req,res) =>{
    res.render('mycourse');
}
