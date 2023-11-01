const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.register = async(req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser= await User.register(user,password);// takes password and hashes it
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            req.flash('success','Welcome to MotelBay!');
              res.redirect('/motels');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
  }


module.exports.login = (req,res)=>{
    //this part executes if login is successfull
   req.flash('success','welcome back!');
    // we can use res.locals.returnTo to redirect the user after login
   const redirectUrl= res.locals.returnTo || '/motels';
 //   delete req.session.returnTo;
   res.redirect(redirectUrl);
 }

 module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/motels');
    });
}