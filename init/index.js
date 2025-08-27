const mongoose=require("mongoose");
const initData=require("./data.js");
 const Listing=require("../models/listing.js");


main().then(()=>{
    console.log("connection success")
}).catch((err)=>{
    console.log("something wrong is happen plz check it");
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    
}
const initDB=async()=>{
    console.log(initData.data)
    //  await Listing.deleteMany({});
     initData.data=initData.data.map((obj)=>({...obj,owner: new mongoose.Types.ObjectId("689e1c3ecc4fd41381ba7550")}));
     await Listing.insertMany(initData.data);
    //  console.log("After mapping:", initData.data[0]);
     console.log("data is initialised");
     
}
initDB();
