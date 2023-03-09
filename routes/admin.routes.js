const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin
  } = require('../middleware/route-guard');


module.exports = router;