const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeoCoding({ accessToken: MapToken })

// module.exports.index = async (req, res) => {

//     let { category } = req.query;
//     let allLists;

//     if (category) {
//         allLists = await Listing.find({ category: category });
//     }
//     else {
//         allLists = await Listing.find();
//     }
//     res.render("./listing/index.ejs", { allLists, category });

//     //  console.log(allLists);
// };

module.exports.index = async (req, res) => {
  let { category, search } = req.query;
  let query = {};

  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive
    query = {
      $or: [
        { title: { $regex: regex } },
        { country: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    };
  } else if (category) {
    query.category = category;
  }

  const allLists = await Listing.find(query);
  res.render("./listing/index.ejs", { allLists, category, search });
};


module.exports.renderNewForm = (req, res) => {

    res.render("./listing/new.ejs");
};
module.exports.createListing = async (req, res) => {
    let response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()


    let url = req.file.path;
    let filename = req.file.filename;


    const listing = req.body.listing;
    

    const newListing = new Listing(listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
     newListing.geometry = response.body.features[0].geometry;
   
    newListing.category = req.body.listing.category;

    let savedListing = await newListing.save();
    console.log(savedListing);
    // console.log(newListing);
    req.flash("success", "New listing created");
    // Redirect back to the same page OR listing page

    res.redirect("/listing");
};
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", } }).populate("owner");

    // for print the reviews message we use populate from the reviews id
    // res.send("yhi dikega sb aage chl",{listings});
    if (!listings) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    }
    else {
        console.log(listings);
        res.render("./listing/show.ejs", { listings });
    }



    // console.log(listings);
};
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);

    if (!listings) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    }
    let originalListingImage = listings.image.url;
    originalListingImage = originalListingImage.replace("/upload", "/upload/h_300,w_250/e_blur:150");
    res.render("./listing/edit.ejs", { listings, originalListingImage });

};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    res.redirect(`/listing`);
};
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");

    res.redirect("/listing");
};
