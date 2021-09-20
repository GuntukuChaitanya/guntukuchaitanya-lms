const express= require("express");
const path = require("path");
// const hbs = require("hbs");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const {checkUser} = require('./middleware/authMiddleware')

const authRoutes=require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const port= process.env.PORT || 3000;

const app= express();
const router = express.Router();

// console.log(path.join(__dirname,"/public"))
// const static_path = path.join(__dirname,"/public");

// const viewPath = path.join(__dirname,"/templates/views");
// const partialsPath = path.join(__dirname,"/templates/views/partials");

require("./db/connect")

const e = require("express");
const { nextTick } = require("process");
const { requireAuth } = require("./middleware/authMiddleware");


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// app.use(express.static(static_path));

app.set("view engine","ejs");

// app.set("views",viewPath);
// app.set("partials", partialsPath);
// hbs.registerPartials(partialsPath);

app.get("*",checkUser);


app.get('/',(req,res)=>{
    res.render("index");
})

app.listen(port,()=>{
    console.log("Server Running at",port);
})


app.use(authRoutes);

