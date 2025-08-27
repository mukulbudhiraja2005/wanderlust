if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
};
const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
 const Listing=require("./models/listing.js");
  const User=require("./models/user.js");
 const listing=require("./routes/listing.js");
 const reviews=require("./routes/review.js");
 const userRoute = require("./routes/user.js");
 const ejsMate=require("ejs-mate");
 const wrapAsync=require("./utils/wrapasync.js");
 const cors = require("cors");
//  const {listingSchema}=require("./schema.js");
 const Review=require("./models/review.js");
 const session=require("express-session");
 const MongoStore = require('connect-mongo');
 const flash=require("connect-flash");
 const passport=require("passport");
//  const passportLocal=require("passport-local");
 const LocalStrategy = require("passport-local").Strategy;
 const path=require("path");

 const methodOverride = require('method-override');
 app.use(methodOverride('_method'));
 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.json()); 
 app.use(express.urlencoded({extended:true}));
 app.engine("ejs",ejsMate);
 app.use(express.static(path.join(__dirname,"/public")));
 const ExpressError =require("./utils/ExpressError.js");
 app.use(cors());
// const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
  const dbUrl=process.env.ATLASDB_URL;
 

// main().then(()=>{
//     console.log("connection success")
// }).catch((err)=>{
//     console.log("something wrong is happen plz check it");
// })
main().then(()=>{
    console.log(" connection success");
}).catch((err)=>{
    console.error(" MongoDB connection error:", err.message);
});


async function main() {
    await mongoose.connect( dbUrl);
    
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
});

const sessionName=({
    store,
    secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{expires:new Date(Date.now()+7*24*60*60*1000),
  maxAge:7*24*60*60*1000,
  httpOnly:true,}
  
});
app.use(session(sessionName));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();

});
// app.use("/signup",(req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     next();

// })
// app.use("/login",(req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.currUser=req.user;
//     next();

// })


// app.get("/",(req,res)=>{
//     res.send("or kya haal chal ,yha sb shi h");
// });
// app.get("/demouser",async(req,res)=>{
//     const fakeUser= new User({
//         email:"hello@gmail.com",
//          username:"blleblleblee",
//     })
//       let registername=await User.register(fakeUser,"helloworld");
//       res.send(registername);

// })

//for different routes we use this to connect routes with main file\

app.use("/listing",listing);
app.use("/listing/:id/reviews",reviews);
app.use("/", userRoute);




// Handles errors
// we use expresserror class
app.all("*", (req, res, next) => {
     let err=next(new ExpressError(404, "Page Not Found"));
     console.log(err);
    
});


app.use((err,req,res,next)=>{
    let{statusCode=500,message="something is wrong"}=err;
   res.status(statusCode).render("./listing/error.ejs",{message});
    
});

app.listen(port,()=>{
    console.log("listening to the port 8080");
})