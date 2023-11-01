const {motelSchemaValidate,reviewSchema} = require('./schemas.js');
const ExpressError =require('./utils/ExpressError');
const Motel = require('./models/motel');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // to go to that page wherever you were firsr asked to log in
     req.flash("error", "You must be signed in");
     return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateMotel = (req,res,next)=>{
   
    const {error}= motelSchemaValidate.validate(req.body);
     if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
     }else{
        next();
     }
 
}

module.exports.isAuthor= async(req,res,next)=>{
   const {id} = req.params;
   const motel = await Motel.findById(id);
   if(!motel.author.equals(req.user_id)){
      req.flash('error','You do not have permission to do this');
      return res.redirect(`/motels/${id}`);
   }
   next();
}

module.exports.isReviewAuthor= async(req,res,next)=>{
   // const {id,reviewId} = req.params;
   // const review = await Review.findById(reviewId);
   // console.log(review);
   // if(!review.author.equals(req.user_id)){
   //    console.log(req.user_id+ " "+ review.author);
   //    req.flash('error','You do not have permission to do this');
   //    return res.redirect(`/motels/${id}`);
   // }
   // console.log('hi')
   next();
}

// validate review middleware
module.exports.validateReview =(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
     }else{
        next();
     }
}
