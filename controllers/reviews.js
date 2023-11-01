const Motel = require('../models/motel');
const Review= require('../models/review')

module.exports.createReview = async(req,res)=>{
    const motel = await Motel.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author = req.user._id;
    motel.reviews.push(review);
    await review.save();
    await motel.save();
    req.flash('success','Created new Review!');
    res.redirect(`/motels/${motel._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Motel.findByIdAndUpdate(id,{ $pull:{reviews:reviewId} })// $pull operator mongodb:It uses the $pull operator to remove the specified reviewId from the reviews array. This effectively deletes the review reference from the motel's reviews.
    await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully deleted review');
    res.redirect(`/motels/${id}`);
  
}