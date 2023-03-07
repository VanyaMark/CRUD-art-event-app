const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  } = require('../middleware/route-guard');

  router.get('/artist', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    res.render('artist/artist-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, userInSessionsId: req.session.currentUser._id, buttonA: "Apply for Exhibition", linkA: "/artist/exhibition-application-form", buttonB: "Favourites", linkB: "/artist/favourites", buttonC: "Application History", linkC: "/artist/application-history"});
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
    
    const { username, email, password, address, phoneNumber, avatarUrl, dateOfBirth, gender, nationality } = req.body;
    
    /*const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('artist/artist-edit', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }*/
   
      bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        /*if (!username || !email || !password) {
          res.render('auth/user-signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
          return;
        }*/
        console.log(`post edot user id ${id}`)
    
          User.findByIdAndUpdate(id, {
            username,
            email,
            passwordHash: hashedPassword,
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
    
   

  })




  //router.post("/artist/:id", isUserLoggedIn, isArtistOrAdmin, (req, res) => {

   // const { id } = req.params;
  
  //})

module.exports = router;