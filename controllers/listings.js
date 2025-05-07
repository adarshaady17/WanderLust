const Listing=require("../models/listing.js");
const mongoose = require("mongoose"); 

module.exports.index = async (req, res) => {
    const { q } = req.query; // Get search query (if any)
    let allListings;

    if (q) {
        // Search listings by title (case-insensitive)
        allListings = await Listing.find({ 
            title: { $regex: q, $options: "i" } 
        });
    } else {
        // If no search term, fetch all listings
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { 
        allListings,
        q: q || "" // Pass search term back to the view
    });
};

module.exports.searchListings = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === "") {
            req.flash("error", "Please enter a search term");
            return res.redirect("/listings");
        }

        const allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } }
            ]
        });

        res.render("listings/index.ejs", { 
            allListings,
            q 
        });
    } catch (err) {
        req.flash("error", "Search failed");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }

        const listing = await Listing.findById(id)
            .populate({ 
                path: "reviews",
                populate: { path: "auther" }
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        next(err);
    }
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing( req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
 
    let originalImageUrl = listing.image.url; 
        originalImageUrl= originalImageUrl.replace("upload", "/upload/w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
 
    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };

    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  };
