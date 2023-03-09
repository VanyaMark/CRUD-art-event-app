
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const ArtistApplication = require('../models/ArtistApplication.model');
const Exhibition = require('../models/Exhibition.model')
const mongoose = require('mongoose');


const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  } = require('../middleware/route-guard');

  router.get('/admin', isUserLoggedIn, isAdmin, (req, res) => {
    res.render('admin/admin-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}, to your personal dashboard.`, userInSessionsId: req.session.currentUser._id, buttonA: "View Exhibitions", linkA: "/findExhibition", buttonB: "working", linkB: "/artist/favourites", buttonC: "working", linkC: "/artist/application-history"});
  })

router.get('/findExhibition', isUserLoggedIn, isAdmin, (req, res) => { 

    Exhibition.find()
    .then((exhibition) => {
            console.log('Exhibition: ', exhibition)
            res.render('exhibition/exhibition-details', {exhibition} )
        })      
}) 

/*router.post('/createExhibition', isUserLoggedIn, isAdmin, (req, res) => {
    const {exhibitionName, artType, exhibitionWeek } = req.body;
    Exhibition.create({
        exhibitionName,
        artType,
        exhibitionWeek,
    })
    .then(newExhibition => {
        console.log('New Exhibition: ', newExhibition)
        res.render('exhibition/created-exhibition', {newExhibition} )
    })
})*/

module.exports = router;
