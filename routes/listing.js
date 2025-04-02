const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");

const listingController = require("../controllers/listings.js");


//Index Route
router.get("/", wrapAsync(listingController.index));

//new Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show Route
router.get("/:id",wrapAsync(listingController.showListing));

//create Route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing)
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
  
  module.exports=router;