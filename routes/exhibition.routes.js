
/*const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const ArtistCart = require('../models/ArtistCart.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  } = require('../middleware/route-guard');

router.get('/artist/application', isUserLoggedIn, isArtistOrAdmin, (req, res) => { 
    //User.findById(req.session.currentUser._id)
    //.then((user)=>{
       // console.log(`This ${user} is awesome!`)
        res.render('artist/artist-app-form')
   // })
    
})



router.post('/artist/application', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const {firstName, lastName, email, age, profilePicUrl, address, phoneNumber, artworkUrl, wallSize, description, dateRequested } = req.body;
    ArtistCart.create({
        firstName,
        lastName,
        email,
        age,
        profilePicUrl,
        address,
        phoneNumber,
        artworkUrl, 
        wallSize, 
        description, 
        dateRequested
    })
    .then(artistCart => {
        console.log('New Artist cart: ', artistCart)
        res.render('artist/artist-cart', {artistCart} )
    })
})

module.exports = router;
*/