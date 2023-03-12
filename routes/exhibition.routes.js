
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

            res.render('exhibition/exhibition-details', {exhibition} )
        })      
}) 

//Get Route for Each Exhibition Details

router.get('/exhibition/:id', isUserLoggedIn, isAdmin, (req, res) => {
    const { id } = req.params
    Exhibition.findById(id)
        .then((exhibition) => {
            res.render('exhibition/each-exhibition-details', {exhibition})
        })
})

//Get Route to edit each exhibition details
router.get('/exhibition/:id/edit', isUserLoggedIn, isAdmin, (req, res) => {
    const { id } = req.params;
    Exhibition.findById(id)
        .then((exhibitionToEdit) => {
            res.render('exhibition/edit-exhibition', {exhibitionToEdit})
        })
})

router.post('/exhibition/:id/edit', isUserLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const { exhibitionStatus, archived, applicationStatus } = req.body;
 
for(let i =0; i<applicationStatus.length;i++){
  let set = {};
  set[`artistApplication.${i}.applicationStatus`] = applicationStatus[i];
  await Exhibition.updateOne({ _id: id },{ $set: set })
}
await Exhibition.findByIdAndUpdate(id, {exhibitionStatus, archived}, {new:true})   
res.redirect(`/exhibition/${id}`)
});




module.exports = router;
