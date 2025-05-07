const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn, isReviewAuther}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

 //post review route
 router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

  //delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuther,wrapAsync(reviewController.deleteReview)
);

module.exports=router;  