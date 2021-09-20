const jwt = require('jsonwebtoken');
const Register = require('../models/userRegisters');

const requireAuth = (req,res,next) =>{

    const token =req.cookies.jwt;
    if(token){
        jwt.verify(token, 'yourlearningmanagementsystem',(err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('login');
            } else{
                console.log("require Auth:->",decodedToken);
                next();
            }
        });
    }else{
        res.render('login');
    }
}

const checkUser=function (req,res,next){
    const token =req.cookies.jwt;
    let details={};
    if(token){
        jwt.verify(token, 'yourlearningmanagementsystem', async (err, decodedToken)=>{
            if(err){
                res.locals.details=null;
                console.log(err.message);
                next();
            } else{
                console.log("check User:->",decodedToken);
                let register = await Register.findById(decodedToken.id);
                console.log("Last name is: ",register.lastname);
                // details = {
                //     dp: register.dp,
                //     firstname: register.firstname,
                //     lastname: register.lastname,
                //     email: register.email
                // }
                // console.log(details);
                // res.json(details);
                res.locals.details=register;
                next();
            }
        });
    }else{
        res.locals.details=null;
        next();
    }
}


module.exports={requireAuth, checkUser}