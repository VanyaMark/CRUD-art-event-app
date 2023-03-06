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
    res.render('artist/artist-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, buttonA: "Apply for Exhibition", linkA: "/artist/exhibition-application-form", buttonB: "Favourites", linkB: "/artist/favourites", buttonC: "Application History", linkC: "/artist/application-history"});
  })

module.exports = router;