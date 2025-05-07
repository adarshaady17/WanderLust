const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const multer = require("multer"); 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 

const listingController = require("../controllers/listings.js");

//Index Route
router          
    .route("/")
    .get( wrapAsync (listingController.index)) //Index Route 
    .post(   //create route
        isLoggedIn,
        upload.single("listing[image]"),   
        validateListing,  
        wrapAsync(listingController.createListing)
    );
  
    router.get("/search", wrapAsync(listingController.searchListings));
   

//new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show Route
router.get("/:id", wrapAsync(listingController.showListing));



//edit route
router.get("/:id/edit", 
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm));
//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
