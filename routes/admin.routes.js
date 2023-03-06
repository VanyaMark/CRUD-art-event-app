const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin
  } = require('../middleware/route-guard');

  router.get('/admin', isUserLoggedIn, (req, res) => {
    res.render('admin/admin-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, buttonA: "Artist Orders", linkA: "/admin/artist-orders", buttonB: "Visitor Orders", linkB: "/admin/visitor-orders", buttonC: "Modify Database", linkC: "/admin/modify-database"});
  })

module.exports = router;