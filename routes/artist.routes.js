const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');

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
          console.log(user)
            res.render('artist/artist-details', { userInSession: req.session.currentUser, user })
        })

  })

  //router.post("/artist/:id", isUserLoggedIn, isArtistOrAdmin, (req, res) => {

   // const { id } = req.params;

    

  
  //})

module.exports = router;