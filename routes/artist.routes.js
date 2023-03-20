const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const Exhibition = require('../models/Exhibition.model')
const ArtistApplication = require('../models/ArtistApplication.model');
const fileUploader = require('../config/cloudinary.config')
const {
  isUserLoggedIn,
  isUserLoggedOut,
  isAdmin,
  isArtistOrAdmin
} = require('../middleware/route-guard');

//This renders the artist's dashboard

router.get('/artist', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  res.render('artist/artist-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}`, userInSessionsId: req.session.currentUser._id, buttonA: "Apply for Exhibition", linkA: "/artistApplication", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" });
})

//This renders the artist's details according to their id

router.get('/artist/:id', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render('artist/artist-details', { userInSession: req.session.currentUser, user, buttonA: "Back To Dashboard", linkA: `/artist`, buttonB: "Edit Account Details", linkB: `/artist/${req.session.currentUser._id}/edit`, buttonC: "Application History", linkC: "/artistOrderHistory" })
    })
})

//This renders artist details on to a form which can then be edited

router.get('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render('artist/artist-edit', { userInSession: req.session.currentUser, user, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Apply for Exhibition", linkC: "/artistApplication" })
    })
})

//This obtains the artist's edited details from the form and saves it on the database

router.post('/artist/:id/edit', isUserLoggedIn, isArtistOrAdmin, fileUploader.single('avatarUrl'), (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, phoneNumber, existingAvatar, dateOfBirth, gender, nationality } = req.body;

  let avatarUrl;
  if (req.file) {
    avatarUrl = req.file.path;
  } else {
    avatarUrl = existingAvatar;
  };

  User.findByIdAndUpdate(id, {
    firstName,
    lastName,
    address,
    phoneNumber,
    avatarUrl,
    dateOfBirth,
    gender,
    nationality
  }, { new: true })
    .then(userFromDB => {
      req.session.currentUser = userFromDB;
      res.redirect(`/artist/${userFromDB.id}`)
    })
    .catch(error => {
      next(error);
    })
})

//This pre-fills the artists application form

router.get('/artistApplication', isUserLoggedIn, isArtistOrAdmin, async (req, res) => {
  let exhibition = await Exhibition.find()
  let exhibitionArray = []
  let user = await User.findById(req.session.currentUser._id)
  Promise.all([user, exhibition])
    .then((values) => {
      values[1].forEach((item) => {
        if (item.exhibitionStatus === "open" && item.archived === false) {
          exhibitionArray.push(item)
        }
      })
      res.render('artist/artist-app-form', { user: values[0], exhibitionToJoin: exhibitionArray, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
    })
})

//This pre-fills the artists cart if the cart is entered from a different page other than the application page

router.get('/artistCart', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const user = req.session.currentUser;
  ArtistApplication.find({ user })
    .then((altArtistApp) => {
      res.render('artist/artist-cart', { altArtistApp, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
    })
})

//This obtains the details filled on the application form and renders it onto the artist cart

router.post('/artistCart', isUserLoggedIn, isArtistOrAdmin, fileUploader.single('artworkUrl'), async (req, res, next) => {
  const user = req.session.currentUser._id
  const { avatarUrl, firstName, lastName, email, dateOfBirth, artType, address, phoneNumber, artworkName, wallSize, description, chooseWeek, applicationStatus } = req.body;
  await User.findByIdAndUpdate(user, {
    firstName,
    lastName, address, phoneNumber, dateOfBirth
  }, { new: true })

  if (req.file) {

    await ArtistApplication.create({
      user,
      avatarUrl,
      firstName,
      lastName,
      email,
      dateOfBirth,
      artType,
      address,
      phoneNumber,
      artworkName,
      artworkUrl: req.file.path,
      wallSize,
      description,
      chooseWeek,
      applicationStatus
    })
      .then(artistApp => {
        res.render('artist/artist-cart', { artistApp, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
      })
      .catch(async (err) => {
        console.log("monkey:", err)
        if (err._message === 'ArtistApplication validation failed' || err instanceof TypeError) {
          let exhibitionToJoin = await Exhibition.find()
          let exhibitionArray = [];
          let user = await User.findById(req.session.currentUser._id)
          Promise.all([user, exhibitionToJoin])
            .then((values) => {
              values[1].forEach((item) => {
                if (item.exhibitionStatus === "open" && item.archived === false) {
                  exhibitionArray.push(item)
                }
              })
              res.render('artist/artist-app-form', { user: values[0], exhibitionToJoin: exhibitionArray, errorMessage: "Error: Please, ensure all fields are complete.", buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
            })
        }
        else if (err.code === 11000) {
          res.render('artist/artist-cart', { errMsg: "You have an application pending. Please, update and submit or delete pending application before starting a new one.", buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
        }
        else { next(err) }
      })
  }
  else {
    let exhibitionToJoin = await Exhibition.find()
    let exhibitionArray = [];
    let user = await User.findById(req.session.currentUser._id)
    Promise.all([user, exhibitionToJoin])
      .then((values) => {
        values[1].forEach((item) => {
          if (item.exhibitionStatus === "open" && item.archived === false) {
            exhibitionArray.push(item)
          }
        })
        res.render('artist/artist-app-form', { user: values[0], exhibitionToJoin: exhibitionArray, errorMessage: "Error: Please, ensure an image is uploaded.", buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
      })
  }
})

//This pre-fills the artist's application form which is to be edited according to the application id

router.get('/artistCart/:id/edit', async (req, res) => {
  const { id } = req.params;
  let artistApptoEdit = await ArtistApplication.findById(id)
  let exhibitionToJoin = await Exhibition.find()
  let exhibitionArray = [];
  Promise.all([artistApptoEdit, exhibitionToJoin])
    .then((values => {
      values[1].forEach((item) => {
        if (item.exhibitionStatus === "open" && item.archived === false) {
          exhibitionArray.push(item)
        }
      })
      res.render('artist/artist-cart-edit', { artistApptoEdit: values[0], exhibitionToJoin: exhibitionArray, buttonA: "Back To Cart", linkA: "/artistCart", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
    }))
})

//This renders the edited application form details onto the artist cart and also saves it in the database

router.post('/artistCart/:id/edit', isUserLoggedIn, isArtistOrAdmin, fileUploader.single('artworkUrl'), (req, res, next) => {
  const { id } = req.params;
  let user = req.session.currentUser._id;
  const { avatarUrl, firstName,
    lastName,
    email,
    dateOfBirth,
    address,
    phoneNumber,
    artworkName,
    existingImage,
    artType,
    wallSize,
    description,
    chooseWeek,
    applicationStatus } = req.body;
  let artworkUrl;
  if (req.file) {
    artworkUrl = req.file.path;
  } else {
    artworkUrl = existingImage;
  };
  User.findByIdAndUpdate(user, {
    avatarUrl,
    firstName,
    lastName,
    address,
    phoneNumber,
    dateOfBirth
  }, { new: true })
  ArtistApplication.findByIdAndUpdate(id, {
    id, user,
    avatarUrl,
    firstName,
    lastName,
    email,
    dateOfBirth,
    address,
    phoneNumber,
    artworkName,
    artworkUrl,
    artType,
    wallSize,
    description,
    chooseWeek,
    applicationStatus
  }, { new: true })
    .then(() => { res.redirect('/artistCart') })
})

//This renders the edited artist application on to the artist cart

router.get('/artistCart', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const user = req.session.currentUser._id
  ArtistApplication.find({ user })
    .then((editedItem) => {
      res.render('artist/artist-cart', { editedItem, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
    })
})

//A filled application form can be deleted before submission

router.post('/artistCart/:id/delete', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const { id } = req.params;
  ArtistApplication.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/artist')
    })
})

//This renders the application submission confirmation page

router.get('/artistSubmitApp', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  res.render('artist/artist-submit-app')
})

//This function is called in the router below it. It pushes artist applications into the application array
//in the exhibition model

async function addArtistAppObject(theExhibitionToUpdate, newArtistApp) {
  let updatedExhibition = await Exhibition.updateOne(
    theExhibitionToUpdate,
    { $push: { artistApplication: newArtistApp } });
}

/*On submission of form, cart gets deleted on database but a copy of the artist application
manually gets populated into the exhibition model (see 'addArtistAppObject' function above)
It was manually done because once the cart gets deleted, the regular .populate() no longer functions. Cart needs to be deleted at the end of each transaction as some of the fields are declared are unique in the model so results in duplication error if those fields are repeated, as well as keeps on rendering old carts on the page even after submission has happened.*/

router.post('/artistSubmitApp', isUserLoggedIn, isArtistOrAdmin, async (req, res) => {
  const { id } = req.session.currentUser._id
  const { avatarUrl, firstName, lastName, email, phoneNumber, address, dateOfBirth, artworkUrl, artType, wallSize, description, chooseWeek, applicationStatus } = req.body;
  const user = req.session.currentUser;
  let exhibition = await Exhibition.find()
  for (let i = 0; i < exhibition.length; i++) {
    if (exhibition[i].exhibitionWeek == chooseWeek.slice(chooseWeek.length - 29, chooseWeek.length)) {
      let artistApplication = JSON.parse(JSON.stringify(req.body))
      addArtistAppObject(exhibition[i], artistApplication)
    }
  }
  await ArtistApplication.findOneAndDelete({ user })
  res.render('artist/artist-submit-app', { buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Application History", linkC: "/artistOrderHistory" })
})

//This displays the artist's exhibition application history

router.get('/artistOrderHistory', isUserLoggedIn, isArtistOrAdmin, (req, res) => {
  const user = req.session.currentUser._id;
  let applicationsArray = [];
  Exhibition.find()
    .then((exhibitionsArray) => {
      for (let exhibition of exhibitionsArray) {
        for (let application of exhibition.artistApplication) {
          if (application.user === user) {
            applicationsArray.push(application)
          }
        }
      }
      res.render('artist/artist-application-history', { applicationsArray, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Apply for Exhibition", linkC: "/artistApplication" })
    })
})

//Renders all artworks by all artists

router.get('/allArtworks', isUserLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  let exhibitionsArray = []
  let applicationsArray = []
  Exhibition.find()
    .then((exhibitionsArr) => {
      for (let exhibition of exhibitionsArr) {
        for (let application of exhibition.artistApplication) {
          if (exhibition.exhibitionStatus !== "cancelled" && exhibition.archived === false && application.applicationStatus === "approved") {
            exhibitionsArray.push(exhibition)
            applicationsArray.push(application)
          }
        }
      }
      res.render('artworks', { exhibitionsArray, applicationsArray, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Apply for Exhibition", linkC: "/artistApplication" })
    })
})

//Collects the favourites picked and saves to the user's favourites array in teh user model
//However, if the favourite already exists, error message is thrown to pick a different favourite

router.post('/allArtworks', isUserLoggedIn, async (req, res) => {

  const id = req.session.currentUser._id;

  const { artworkUrl } = req.body;

  let favourites = JSON.parse(JSON.stringify(req.body))
  let user = await User.findById(id)
  let favArtworkArray = []

  if (user.favourites.length === 0) {
    addFavouriteArtworkToUser(user, favourites)
    res.redirect('/allArtworks')
    console.log('monkey')
  }
  else {
    console.log('artworkUrl: ', artworkUrl)
    for (let i = 0; i < user.favourites.length; i++) {
      favArtworkArray.push(user.favourites[i].artworkUrl)
    }
    const duplicate = favArtworkArray.some(item => item === artworkUrl)
    if (duplicate) {
      let exhibitionsArray = []
      let applicationsArray = []
      Exhibition.find()
        .then((exhibitionsArr) => {
          for (let exhibition of exhibitionsArr) {
            for (let application of exhibition.artistApplication) {
              if (exhibition.exhibitionStatus !== "cancelled" && exhibition.archived === false) {
                exhibitionsArray.push(exhibition)
                applicationsArray.push(application)
              }
            }
          }
          res.render('artworks', { exhibitionsArray, applicationsArray, errorMsg: "Already added to favourites. Pick new Image", buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Favourites", linkB: "/artistFavourites", buttonC: "Apply for Exhibition", linkC: "/artistApplication" })
        })
    }
    else {
      addFavouriteArtworkToUser(user, favourites)
      res.redirect('/allArtworks')
      console.log('added to favourites')
    }
  }
})

//Function to push favourite artwork picked into the favourite's array in the user model

async function addFavouriteArtworkToUser(userToUpdate, favouriteArtwork) {
  let updatedUser = await User.updateOne(
    userToUpdate,
    { $push: { favourites: favouriteArtwork } });
}

//Renders all the favourite artwork chosen by a specific user

router.get('/artistFavourites', isUserLoggedIn, (req, res) => {
  let id = req.session.currentUser._id
  User.findById(id)
    .then((user) => {

      res.render('artist/artist-favourites', { user, buttonA: "Back To Dashboard", linkA: "/artist", buttonB: "Back to all Artwork", linkB: "/allArtworks", buttonC: "Apply for Exhibition", linkC: "/artistApplication" })
    })
})


module.exports = router;