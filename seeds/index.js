const mongoose= require('mongoose');
const Motel =require('../models/motel');
const cities = require('./cities');
const {places,descriptors}=require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/motel-bay', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000 // Set a longer timeout value
    })
    console.log("connected ")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Motel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceran = Math.floor(Math.random()*1000)+10;
        const motel = new Motel({
            author:'64e976238b95ef55d2b2e837', //username:user1 ,password:user1 emial:user1@gmail.com for local
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'swad hi aa jana , ik vari ja k  vek h , vaafk fmajak aauan',
            price:priceran,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
          },
            images:[
                {
                  url: 'https://res.cloudinary.com/dsbb6pkbk/image/upload/v1693117914/MOTELBAY/tewlfoyhup5yvxdrci5a.jpg',
                  filename: 'MOTELBAY/tewlfoyhup5yvxdrci5a',
                },
                {
                  url: 'https://res.cloudinary.com/dsbb6pkbk/image/upload/v1693117915/MOTELBAY/obvkbzdmpg5j5hyep6dr.jpg',
                  filename: 'MOTELBAY/obvkbzdmpg5j5hyep6dr',
                }
              ]
        });
       
        const res = await motel.save();
        console.log(res);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

//   author:'64e976238b95ef55d2b2e837', //username:user1 ,password:user1 emial:user1@gmail.com for local