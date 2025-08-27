const express=require("express");
const router=express.Router();
 const {listingSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const listingController=require("../controllers/listings.js");
const ExpressError =require("../utils/ExpressError.js");
const{isLoggedIn,isOwner,validateListing}=require("../middlewares");
const multer  = require('multer')
const{storage}=require("../cloudconfig.js");
const upload = multer({storage});


//middlewares for server side error
// 1 middleware for listing validation
// const validateListing=(req,res,next)=>{
//     let{error}=listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };



// indexroute= to show all titles
router.get("/",wrapAsync(listingController.index));
// newroute
router.get("/new",isLoggedIn,listingController.renderNewForm);
// createroute
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//show route=to show specific details

router.get("/:id",wrapAsync(listingController.showListing));


//edit and update route
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image][url]"),wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;