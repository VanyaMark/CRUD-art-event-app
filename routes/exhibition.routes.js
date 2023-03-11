
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

router.post('/exhibition/:id/edit', isUserLoggedIn, isAdmin,  (req, res) => {
    const { id } = req.params;
    const { exhibitionStatus, archived, artistApplication, applicationStatus } = req.body;

console.log('req.body: ', req.body)
console.log('req.body.applicationStatus: ', req.body.applicationStatus[0])
})
 //   let exhibitionToUpdate = await Exhibition.findById(id)
 //   exhibitionToUpdate.artistApplication
// [a, b, c]  req.body.applicationStatus[i]

/*  Exhibition.findByIdAndUpdate(id, {exhibitionStatus, archived, artistApplication, applicationStatus}, {new: true} )
        .then(()=>{res.redirect('/findExhibition')}) 
})
[{a : John},{a: Tom }, {a: Harry}] => [{a: Diana}, {a: Meghan}, {a: Kate}]

 function updateApplicationStatusArray (err) {
    if (err) throw err;
    //const collection = db.collection(‘myCollection’);

    Exhibition.updateOne(
      { id, `artistApplication.indexOf(${i})`: `${i}` },
      { $set: { "artistApplication.$.applicationStatus": `${req.body.applicationStatus[0]}` } }
      function(err, result) {
        if (err) throw err
        console.log(result);
     
      }
    );
    } */

   /* MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const collection = db.collection(‘myCollection’);
        collection.updateOne(
          { _id: ObjectId("617a04e00a774c0e41a0a3d1"), "hobbies.name": “swimming” },
          { $set: { “hobbies.$.level”: “expert” } },
          function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
          }
        );
      });*/




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
