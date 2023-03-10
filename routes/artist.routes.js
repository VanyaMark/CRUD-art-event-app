const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const Exhibition = require('../models/Exhibition.model')
const ArtistApplication = require('../models/ArtistApplication.model');
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  } = require('../middleware/route-guard');

  router.get('/artist', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    res.render('artist/artist-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}, to your personal dashboard.`, userInSessionsId: req.session.currentUser._id, buttonA: "Apply for Exhibition", linkA: "/artistApplication", buttonB: "Favourites", linkB: "/artist/favourites", buttonC: "Application History", linkC: "/artist/application-history"});
  })

  router.get('/artist/:id', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
  
    User.findById(id)
        .then(user => {
          console.log(`user from get artist id route: ${user}` )
            res.render('artist/artist-details', { userInSession: req.session.currentUser, user })
        })

  })

  router.get('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
   console.log(`get edit route id ${id}`)
    User.findById(id)
        .then(user => {
          console.log(`***user from get edit route: ${user}`)
            res.render('artist/artist-edit', { userInSession: req.session.currentUser, user })
        })
  })

  router.post('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const { id } = req.params;
    
    const { username, firstName, lastName, email, password, address, phoneNumber, avatarUrl, dateOfBirth, gender, nationality } = req.body;
    
    /*const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('artist/artist-edit', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
   
      bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        if (!username || !email || !password) {
          res.render('artist/artist-edit', { errorMessage: 'Please ensure username, email and password fields are complete.' });
          return;
        }*/
        console.log(`post edit user id ${id}`)
    
          User.findByIdAndUpdate(id, {
           // username,
            firstName,
            lastName,
           // email,
           // passwordHash: hashedPassword,
            address, phoneNumber, avatarUrl, dateOfBirth, gender, nationality
       
          }, {new:true})
          
          .then(userFromDB => {
            req.session.currentUser = userFromDB;
            console.log('The updated user is: ', userFromDB);
            res.redirect(`/artist/${userFromDB.id}`)
          })
          .catch(error => {
            /*  if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/user-signup', { errorMessage: error.message });
            } 
            else if (error.code === 11000) {
              res.status(500).render('auth/user-signup', {
                 errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              })
            } */
            
                next(error);
            
          })
      })

/*  router.get('/artistApplication', isUserLoggedIn, isArtistOrAdmin, (req, res) => { 
    User.findById(req.session.currentUser._id)
    .then((user)=>{
      console.log('user: ', user)
    Exhibition.find()
      .then((exhibitionToJoin) => {
        console.log('exhibitionToJoin: ', exhibitionToJoin)
        if (exhibitionToJoin.exhibitionStatus === "open" && exhibitionToJoin.archived === false) {
          res.render('artist/artist-app-form', {user, exhibitionToJoin})
        }
      })
    })   
}) */

  router.get('/artistApplication', isUserLoggedIn, isArtistOrAdmin, async (req, res) => { 
    let exhibitionToJoin = await Exhibition.find()
    console.log('exhibitionToJoin: ', exhibitionToJoin)
    //  if (exhibitionToJoin.exhibitionStatus === "open" && exhibitionToJoin.archived === false) {
          let user = await User.findById(req.session.currentUser._id)
            console.log('user: ', user)
          Promise.all([user, exhibitionToJoin])
            .then((values) => {
              res.render('artist/artist-app-form', {user: values[0], exhibitionToJoin: values[1]})
            })
      //  }
      })



router.post('/artistCart', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
    const user = req.session.currentUser._id
    const {firstName, lastName, email, dateOfBirth, artType, profilePicUrl, address, phoneNumber, artworkName, artworkUrl, wallSize, description, chooseWeek, applicationStatus } = req.body;
    ArtistApplication.create({user,
        firstName,
        lastName,
        email,
        dateOfBirth,
        artType,
        profilePicUrl,
        address,
        phoneNumber,
        artworkName,
        artworkUrl,
        wallSize, 
        description, 
        chooseWeek,
        applicationStatus
    })
    .then(artistApp => {
        console.log('New Artist cart: ', artistApp)
        res.render('artist/artist-cart', {artistApp} )
    })
   .catch(async (err)=> {
      console.log('err code: ', typeof err.code)

 if (err._message === 'ArtistApplication validation failed') {
  let exhibitionToJoin = await Exhibition.find()
    console.log('exhibitionToJoin: ', exhibitionToJoin)
    //  if (exhibitionToJoin.exhibitionStatus === "open" && exhibitionToJoin.archived === false) {
          let user = await User.findById(req.session.currentUser._id)
            console.log('user: ', user)
          Promise.all([user, exhibitionToJoin])
            .then((values) => {
              res.render('artist/artist-app-form', {user: values[0], exhibitionToJoin: values[1], errorMessage: "Error: Please, ensure all fields are complete."})
            })
      } 
      else if (err.code === 11000) {res.render('artist/artist-cart', {errMsg: "You have an application pending. Please, update and submit or delete pending application before starting a new one."}) 
   }
}) 
})


router.get('/artistCart/:id/edit', async (req, res) => {
  const { id } = req.params;
  let artistApptoEdit = await ArtistApplication.findById(id)
  let exhibitionToJoin = await Exhibition.find()
  Promise.all([artistApptoEdit, exhibitionToJoin])
    .then((values => {
      res.render('artist/artist-cart-edit', {artistApptoEdit: values[0], exhibitionToJoin: values[1]})
    }))
})

/*router.get('/artistApplication', isUserLoggedIn, isArtistOrAdmin, async (req, res) => { 
  let exhibitionToJoin = await Exhibition.find()
  console.log('exhibitionToJoin: ', exhibitionToJoin)
  //  if (exhibitionToJoin.exhibitionStatus === "open" && exhibitionToJoin.archived === false) {
        let user = await User.findById(req.session.currentUser._id)
          console.log('user: ', user)
        Promise.all([user, exhibitionToJoin])
          .then((values) => {
            res.render('artist/artist-app-form', {user: values[0], exhibitionToJoin: values[1]})
          })
    //  }
    }) */


router.post('/artistCart/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res, next) =>{
    const { id } = req.params;
    const { firstName,
      lastName,
      email,
      dateOfBirth,
      profilePicUrl,
      address,
      phoneNumber,
      artworkName,
      artworkUrl,
      artType, 
      wallSize, 
      description, 
      chooseWeek,
      applicationStatus } = req.body;
      ArtistApplication.findByIdAndUpdate(id,{
          firstName,
          lastName,
          email,
          dateOfBirth,
          profilePicUrl,
          address,
          phoneNumber,
          artworkName,
          artworkUrl,
          artType, 
          wallSize, 
          description, 
          chooseWeek,
          applicationStatus
      }, {new: true})
      .then(()=>{res.redirect('/artistCart')})
  
} )

router.post('/artistCart/:id/delete', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const { id } = req.params;
  console.log('delete: ', id);

  ArtistApplication.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/artist')
    })
})

router.get('/artistCart', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const user = req.session.currentUser._id
  ArtistApplication.find({user})
  .then((editedItem)=>{
    
    console.log('flonkey: ', editedItem);
    
    res.render('artist/artist-cart', {editedItem})
  })
      
    })

router.get('/artistSubmitApp', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  res.render('artist/artist-submit-app')
})

async function addArtistAppObject(theExhibitionToUpdate, newArtistApp) {
  let updatedExhibition = await Exhibition.updateOne(
    theExhibitionToUpdate, 
    {$push: {artistApplication: newArtistApp}});
    console.log('Updated Exhibiton:', updatedExhibition)

}

router.post('/artistSubmitApp', isUserLoggedIn, isArtistOrAdmin, async (req, res) => {
  const { id } = req.session.currentUser._id
  console.log('session.currentUser: ',req.session.currentUser)
  const user = req.session.currentUser;
//  let artistApplication = []
const {profilePicUrl, firstName, lastName, email, phoneNumber, address, dateOfBirth, artworkUrl, artType, wallSize, description, chooseWeek} = req.body;
  console.log('monkey')
  console.log("req.body: ", req.body)
  
  let exhibition = await Exhibition.find()
for (let i = 0; i < exhibition.length; i++) {
    if (exhibition[i].exhibitionWeek == chooseWeek) {
    console.log('exhibition: ', exhibition[i])
    let artistApplication = JSON.parse(JSON.stringify(req.body)) 
    addArtistAppObject(exhibition[i], artistApplication)
  } 
}

await ArtistApplication.findOneAndDelete({user})

  res.render('artist/artist-submit-app')
})

module.exports = router;