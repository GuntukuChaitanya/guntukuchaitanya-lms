const { Router } = require('express');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const user = require('../models/userRegisters')


const authController = require('../controllers/authControllers');
const {requireAuth} = require('../middleware/authMiddleware');

const router = Router();

router.get('/register',authController.getRegister);


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer( {storage: storage });

router.post('/register',upload.single('img') , authController.postRegister);

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/dashboard',requireAuth,authController.getDashboard);

router.get('/logout',authController.getLogout);

router.get('/mycourse',authController.getMyCourse)

module.exports = router;
