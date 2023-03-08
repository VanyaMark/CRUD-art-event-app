const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const ArtistApplication = require('../models/ArtistApplication.model');
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  } = require('../middleware/route-guard');

  router.get('/artist', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    res.render('artist/artist-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, userInSessionsId: req.session.currentUser._id, buttonA: "Apply for Exhibition", linkA: "/artistApplication", buttonB: "Favourites", linkB: "/artist/favourites", buttonC: "Application History", linkC: "/artist/application-history"});
  })

  router.get('/artist/:id', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
  
    User.findById(id)
        .then(user => {
          console.log(`user from get artist id route: ${user}` )
            res.render('artist/artist-details', { userInSession: req.session.currentUser, user })
        })

  })

  router.get('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
   console.log(`get edit route id ${id}`)
    User.findById(id)
        .then(user => {
          console.log(`***user from get edit route: ${user}`)
            res.render('artist/artist-edit', { userInSession: req.session.currentUser, user })
        })
  })

  router.post('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
    
    const { username, firstName, lastName, email, password, address, phoneNumber, avatarUrl, dateOfBirth, gender, nationality } = req.body;
    
    /*const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('artist/artist-edit', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
   
      bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        if (!username || !email || !password) {
          res.render('artist/artist-edit', { errorMessage: 'Please ensure username, email and password fields are complete.' });
          return;
        }*/
        console.log(`post edit user id ${id}`)
    
          User.findByIdAndUpdate(id, {
           // username,
            firstName,
            lastName,
           // email,
           // passwordHash: hashedPassword,
            address, phoneNumber, avatarUrl, dateOfBirth, gender, nationality
       
          }, {new:true})
          
          .then(userFromDB => {
            req.session.currentUser = userFromDB;
            console.log('The updated user is: ', userFromDB);
            res.redirect(`/artist/${userFromDB.id}`)
          })
          .catch(error => {
            /*  if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/user-signup', { errorMessage: error.message });
            } 
            else if (error.code === 11000) {
              res.status(500).render('auth/user-signup', {
                 errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              })
            } */
            
                next(error);
            
          })
      })

  router.get('/artistApplication', isUserLoggedIn, isArtistOrAdmin, (req, res) => { 
    User.findById(req.session.currentUser._id)
    .then((user)=>{
       // console.log(`This ${user} is awesome!`)
        res.render('artist/artist-app-form', {user})
    })
    
})


router.post('/artistCart', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const {firstName, lastName, email, dateOfBirth, artType, profilePicUrl, address, phoneNumber, artworkUrl, wallSize, description, dateRequested } = req.body;
    ArtistApplication.create({
        firstName,
        lastName,
        email,
        dateOfBirth,
        profilePicUrl,
        address,
        phoneNumber,
        artworkUrl,
        artType, 
        wallSize, 
        description, 
        dateRequested
    })
    .then(artistApp => {
      console.log('donkey: ', artistApp)
        console.log('New Artist cart: ', artistApp)
        res.render('artist/artist-cart', {artistApp} )
    })
})

router.get('artistCart/:id', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const {id} = req.params

  ArtistApplication.findById(id)
    .then((app) =>{
      console.log('monkey: ', app);
      res.render('artist/artist-cart', {app})
    })
})

router.get('/artistCart/:id/edit', (req, res) => {
  const { id } = req.params;
  ArtistApplication.findById(id)
    .then((artistApp => {
      res.render('artist/artist-cart-edit', {artistApp})
    }))
})

router.post('/artistCart/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res, next) =>{
  const { id } = req.params;
  const { firstName,
    lastName,
    email,
    dateOfBirth,
    profilePicUrl,
    address,
    phoneNumber,
    artworkUrl,
    artType, 
    wallSize, 
    description, 
    dateRequested } = req.body;
    ArtistApplication.findByIdAndUpdate(id,{
        firstName,
        lastName,
        email,
        dateOfBirth,
        profilePicUrl,
        address,
        phoneNumber,
        artworkUrl,
        artType, 
        wallSize, 
        description, 
        dateRequested
    }, {new: true})
    .then((app)=>{res.redirect(`/artistCart/${app.id}`)})
  
} )

module.exports = router;