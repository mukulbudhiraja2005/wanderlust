const mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const Schema= mongoose.Schema;
const Review=require("./review.js");
const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
          
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
             type:Schema.Types.ObjectId,
             ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
             ref:"User"


    },
    geometry:{
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }, 
   category:{
    type:String,
    enum:["Mountain","Rooms","castles","Arctic","Trending","Amazing Pools","camping","farms","Iconic Cities"]
   }


    });
ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(!listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    };
})

const Listing =mongoose.model("Listing",ListingSchema);
module.exports= Listing;