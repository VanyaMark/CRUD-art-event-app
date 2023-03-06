const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose')
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin
  } = require('../middleware/route-guard');

router.get('/visitor', isUserLoggedIn, (req, res) => {
    res.render('visitor/visitor-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, buttonA: "Upcoming Exhibitions", linkA: "/visitor/exhibitions", buttonB: "Favourites", linkB: "/visitor/favourites", buttonC: "Exhibitions Attended", linkC: "/visitor/exhibitions-attended"});
  })


module.exports = router;