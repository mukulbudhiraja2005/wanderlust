const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapasync.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const ExpressError =require("../utils/ExpressError.js")
const{isLoggedIn,isReviewAuthor}=require("../middlewares");
 const Review=require("../models/review.js");
 const reviewController=require("../controllers/review.js");

 // 2 middleware for review validation
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;