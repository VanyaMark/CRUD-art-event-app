
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

//Renders the page on which the admin can create new exhibitions

router.get('/exhibition/create',isUserLoggedIn, isAdmin, (req, res, next) => {
    res.render('exhibition/exhibition-create-form')
});

//Obtains the exhibition information entered by admin on form and saves new exhibition to database

router.post('/exhibition/create', isUserLoggedIn, isAdmin,(req, res, next) => {
    const {exhibitionName, exhibitionDescription, startDay, firstDate,lastDate, endDay, maxSpeed} = req.body;
    let exhibitionWeek = `${startDay}-${firstDate}-${endDay}-${lastDate}`
    Exhibition.create({exhibitionName,exhibitionDescription, exhibitionWeek, maxSpeed})
    .then(()=> res.redirect('/findExhibition'))
    .catch(err => {
      if (err.code === 11000) {
        res.render('exhibition/exhibition-create-form', {errMsg: "Exhibition already exists. Create a new one."}) 
      }
  })
});

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
  const { exhibitionStatus, archived, applicationStatus } = req.body;
 
for(let i =0; i<applicationStatus.length;i++){
  let set = {};
  set[`artistApplication.${i}.applicationStatus`] = applicationStatus[i];
  await Exhibition.updateOne({ _id: id },{ $set: set })
}
await Exhibition.findByIdAndUpdate(id, {exhibitionStatus, archived}, {new:true})   
res.redirect(`/exhibition/${id}`)
});

//Renders all exhibitions

router.get('/findExhibition', isUserLoggedIn, isAdmin, (req, res) => { 

  Exhibition.find()
  .then((exhibition) => {

          res.render('exhibition/exhibition-details', {exhibition} )
      })      
}) 

//Delete an exhibition

router.post('/exhibition/:id/delete', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const { id } = req.params;
  console.log('tiger')
  Exhibition.findById(id)
    .then((exhibitionToDelete) => {
      console.log('exhibitionToDelete: ', exhibitionToDelete)
      if (exhibitionToDelete.artistApplication.length === 0) {
        console.log('monkey')
          Exhibition.findByIdAndDelete(exhibitionToDelete.id)
            .then(() => {
              res.redirect('/findExhibition')
            })
      } else {
        res.render('exhibition/each-exhibition-details', {errorMessage: 'Cannot delete exhibitions cointaining applications', exhibitionToDelete})
      }
    })
})


module.exports = router;
