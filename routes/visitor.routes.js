const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose')
const {
  isUserLoggedIn,
  isUserLoggedOut,
  isAdmin
} = require('../middleware/route-guard');

//Visitor dashboard - left as a placeholder for further CRUD practice after the course

router.get('/visitor', isUserLoggedIn, (req, res) => {
  res.render('visitor/visitor-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}, the site is currently under construction. Bear with us and it will be up and running in no time!`, buttonA: "Purchase Tickets", linkA: "/purchaseTickets", buttonB: "Favourites", linkB: "/favourites", buttonC: "Exhibitions Attended", linkC: "/exhibitionsAttended" });
})

module.exports = router;