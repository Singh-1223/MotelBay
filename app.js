if(process.env.NODE_ENV !== "production"){ //This line of code checks if the NODE_ENV environment variable is not set to "production". If it's not in production mode, the code loads and configures the .env file using the dotenv package.
    require('dotenv').config();   //require('dotenv').config(): The dotenv package allows you to load environment variables from a .env file into process.env. This is useful for keeping sensitive information (like API keys, database credentials, etc.) separate from your codebase. The config() method loads the variables defined in the .env file into the current environment.
}

const express = require('express');
const port=80;
const path=require('path');
const mongoose= require('mongoose');
const ejsMate = require('ejs-mate'); //required for using boilerplate code;
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError =require('./utils/ExpressError');
const methodOverride = require('method-override');//required for overriding method requests
const passport =require('passport');  
const LocalStrategy= require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users')
const motelsRoutes= require('./routes/motels');
const reviewsRoutes = require('./routes/reviews')
const mongodbUrl = process.env.DB_URL;

main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000 // Set a longer timeout value
    })
    console.log("connected ")

}



const app=express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))//used for parsing
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

const sessionConfig ={
    name:'session', // give any random name to avoid default name which is easy to track 
   secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
     cookie:{
        httpOnly:true,
        // secure:true, // uncomment this while deploying
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
   }
}
app.use(session(sessionConfig));
app.use(flash());



//Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//// Configure Passport to use LocalStrategy for authentication
passport.use(new LocalStrategy(User.authenticate()));
// Serialize and deserialize user data for session management
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setting flash middleware
app.use((req,res,next)=>{
    res.locals.currentUser = req.user; // this way, you have access to currentUser in all of the templates
    res.locals.success =req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({email:'alpah@gmail.com',username:'alpha'})
//     const newUser= await User.register(user,'chicken')
//     res.send(newUser);
// })

// using routes middleware
app.use('/',userRoutes);
app.use('/motels',motelsRoutes);
app.use('/motels/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});



//app.all('*', ...): This line sets up a middleware that matches any HTTP method (GET, POST, PUT, etc.) and any route. The * wildcard means it will match any route.
app.all('*',(req,res,next)=>{
     // This middleware will match any route ('*')
    next(new ExpressError('Page Not Found',404));
    // Create a new error using a custom error class 'ExpressError'
  // 'Page Not Found' is the error message, and 404 is the status code
 
})

app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message)err.message='Something went wrong!';
    res.status(statusCode).render('error',{err});

})

app.listen(port,()=>{
    console.log(`serving on port ${port}`)
})