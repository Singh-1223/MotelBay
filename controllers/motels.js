const Motel = require("../models/motel");
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
  const motels = await Motel.find({});
  res.render("motels/index", { motels });
};

module.exports.renderNewForm = (req, res) => {
  res.render("motels/new");
};

module.exports.createMotel = async (req, res, next) => {

  const motel = new Motel(req.body.motel);
  motel.images =  req.files.map(f=>({ url: f.path, filename: f.filename }));
  motel.author = req.user._id;
  await motel.save();
   req.flash("success", "Successfully made a new Motel!");
  res.redirect(`/motels/${motel._id}`);
};

module.exports.showMotel = async (req, res) => {
  // Find the motel by its ID and populate the 'reviews' and 'author' fields
  //the populate() method in Mongoose allows you to retrieve referenced data from other collections and replace reference IDs with actual data.
  // eg-)populate('reviews'): This populates the 'reviews' field of the motel with the actual review data. This is often used when the 'reviews' field in the motel schema is set as an array of references to review documents.
  const motel = await Motel.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        // nested populate as for each review , we has reviews author
        path: "author", // populating author of review
      },
    })
    .populate("author"); // this is author of motel

  if (!motel) {
    req.flash("error", "Cannot find the motel");
    return res.redirect("/motels");
  }
  res.render("motels/show", { motel });
};


module.exports.renderEditForm = async(req,res)=>{
    const {id}= req.params;
    const motel = await Motel.findById(id);
   if(!motel){
     req.flash('error','Cannot find the motel');
     return res.redirect('/motels');
     }
    
    res.render('motels/edit',{ motel });
 }

 module.exports.updateMotel = async(req,res)=>{
    const {id}= req.params;
    const motel= await Motel.findByIdAndUpdate(id,{ ...req.body.motel});
    const imgs = req.files.map(f=>({ url: f.path, filename: f.filename }))
    motel.images.push(...imgs);
    await motel.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
         }
        await motel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated motel!')
    res.redirect(`/motels/${motel._id}`);
 }

 module.exports.deleteMotel = async(req,res)=>{
    const {id} =req.params;
    await Motel.findByIdAndDelete(id);
    req.flash('success','Successfully deleted motel');
    res.redirect('/motels');
 }