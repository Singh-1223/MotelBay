// this is routes/motels.js

const express = require('express');
const router = express.Router();
const motels = require('../controllers/motels');//controller where we have put all logic
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateMotel} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})

const Motel = require('../models/motel');

// all logics are in controllers/motels , here we using motels=require('../controller/motels') to access it ;

//can restructure routes using router.route
router.route('/')
         .get(catchAsync(motels.index))
         .post(isLoggedIn, upload.array('image'), validateMotel, catchAsync(motels.createMotel));
         //  .post(upload.array('image'),(req,res)=>{// 
         //    console.log(req.body,req.files);
         //    res.send('it works');
         //  })

router.get('/new',isLoggedIn,motels.renderNewForm);

router.route('/:id')
         .get(catchAsync(motels.showMotel))
         .put(isLoggedIn,upload.array('image'),validateMotel,catchAsync(motels.updateMotel))
         .delete(isLoggedIn,catchAsync(motels.deleteMotel));


router.get('/:id/edit',isLoggedIn,catchAsync(motels.renderEditForm));

module.exports = router;  