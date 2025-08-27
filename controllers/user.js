const User=require("../models/user.js");
 module.exports.getSignedForm=(req,res)=>{
    res.render("./user/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
         let{username,email,password}=req.body;
     const newUser=new User({username,email});
     // password is not automatically stored to stored pasword we use passport-local-mongoose shortcut (register method) which 
     // stored the password using hashing function
     const registerUser= await User.register(newUser,password);
     req.login(registerUser,(err)=>{
         if(err){
            return next(err)
        }
        console.log(registerUser);
     req.flash("success","welcome to wanderlust");
     res.redirect("/listing");
    })
     
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   };
   module.exports.getLogin=(req,res)=>{
    res.render("./user/login.ejs");
   };
   module.exports.login=(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in. ");
     res.redirect(res.locals.redirectUrl||"/listing");  //  login ke baad original page pe redirect
    };
    module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged out");
        res.redirect("/listing");
    })
    

   };
