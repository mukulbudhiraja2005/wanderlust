// for server side validation we use joi
const Joi = require('joi');
//validation schema for listing
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        category:Joi.string().required(),
        
    }).required(),
});

// validation schema for review

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
       
        rating:Joi.number().required().min(1).max(5),
        
        comment:Joi.string().required(),
    }).required(),

});