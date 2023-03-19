
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const ArtistApplication = require('../models/ArtistApplication.model');
const Exhibition = require('../models/Exhibition.model')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const emailtemplate = require('../templates/email')
const {
  isUserLoggedIn,
  isUserLoggedOut,
  isAdmin,
  isArtistOrAdmin
} = require('../middleware/route-guard');


//renders the admin dashboard

router.get('/admin', isUserLoggedIn, isAdmin, (req, res) => {
  res.render('admin/admin-dashboard', { userInSession: `Welcome ${req.session.currentUser.username}, to your personal dashboard.`, userInSessionsId: req.session.currentUser._id, buttonA: "View Exhibitions", linkA: "/findExhibition", buttonB: "Create New Exhibition", linkB: "/exhibition/create", buttonC: "Email Clients", linkC: "/sendEmail" });
})

//Renders the page on which the admin can create new exhibitions

router.get('/exhibition/create', isUserLoggedIn, isAdmin, (req, res, next) => {
  res.render('exhibition/exhibition-create-form', { buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "View Exhibtions", linkB: "/findExhibition", buttonC: "Email Clients", linkC: "/sendEmail" })
});

//Obtains the exhibition information entered by admin on form and saves new exhibition to database

router.post('/exhibition/create', isUserLoggedIn, isAdmin, (req, res, next) => {
  const { exhibitionName, exhibitionDescription, startDay, firstDate, lastDate, endDay } = req.body;
  let exhibitionWeek = `${startDay}-${firstDate}-${endDay}-${lastDate}`
  Exhibition.create({ exhibitionName, exhibitionDescription, exhibitionWeek })
    .then(() => res.redirect('/findExhibition'))
    .catch(err => {
      if (err.code === 11000) {
        res.render('exhibition/exhibition-create-form', { errMsg: "Exhibition already exists. Create a new one.", buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "View Exhibtions", linkB: "/findExhibition", buttonC: "Email Clients", linkC: "/sendEmail" })
      }
    })
});

//Get Route for Each Exhibition Details

router.get('/exhibition/:id', isUserLoggedIn, isAdmin, (req, res) => {
  const { id } = req.params
  Exhibition.findById(id)
    .then((exhibition) => {
      res.render('exhibition/each-exhibition-details', { exhibition, buttonA: "View Exhibitions", linkA: "/findExhibition", buttonB: "Create New Exhibition", linkB: "/exhibition/create", buttonC: "Back To Dashboard", linkC: "/admin" })
    })
})

//Get Route to edit each exhibition details
router.get('/exhibition/:id/edit', isUserLoggedIn, isAdmin, (req, res) => {
  const { id } = req.params;
  Exhibition.findById(id)
    .then((exhibitionToEdit) => {
      res.render('exhibition/edit-exhibition', { exhibitionToEdit, buttonB: "View Exhibitions", linkB: "/findExhibition", buttonC: "Create New Exhibition", linkC: "/exhibition/create", buttonA: "Back To Dashboard", linkA: "/admin" })
    })
})

//collects edited information about exhibition and updates the database

router.post('/exhibition/:id/edit', isUserLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  let set = {};
  const { exhibitionStatus, archived, applicationStatus } = req.body;
  if (!applicationStatus) {
    await Exhibition.findByIdAndUpdate(id, { exhibitionStatus, archived }, { new: true })
    res.redirect(`/exhibition/${id}`)
  }
  else if (applicationStatus.length === 1){
   
    set[`artistApplication.${0}.applicationStatus`] = applicationStatus[0];
    await Exhibition.updateOne({ _id: id }, { $set: set })
  }
  else if (applicationStatus.length > 1) {
 
    for (let i = 0; i < applicationStatus.length; i++) {
      set[`artistApplication.${i}.applicationStatus`] = applicationStatus[i];
      await Exhibition.updateOne({ _id: id }, { $set: set })
    }
    await Exhibition.findByIdAndUpdate(id, { exhibitionStatus, archived }, { new: true })
    res.redirect(`/exhibition/${id}`)

  }

})

//Renders all exhibitions

router.get('/findExhibition', isUserLoggedIn, isAdmin, (req, res) => {

  Exhibition.find()
    .then((exhibition) => {

      res.render('exhibition/exhibition-details', { exhibition, buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "Create New Exhibition", linkB: "/exhibition/create", buttonC: "Email Clients", linkC: "/sendEmail" })
    })
})

//Deletes an exhibition

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
        res.render('exhibition/each-exhibition-details', { errorMessage: 'Cannot delete exhibitions cointaining applications', exhibitionToDelete })
      }
    })
})

//renders the page on which the email form is so that the admin can email clients from this form

router.get('/sendEmail', isUserLoggedIn, isAdmin, (req, res, next) => {
  res.render('admin/admin-email', { buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "View Exhibtions", linkB: "/findExhibition", buttonC: "Create New Exhibition", linkC: "/exhibition/create" })
})

//Collect information entered in form and emails it to receipient.
//Service yahoo has been used as gmail no longer provides app passwords for security reasons

router.post('/emailSent', isUserLoggedIn, isAdmin, async (req, res, next) => {
  let { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({

    service: "yahoo",
    //secure:true,
    //port: 465,
    secure: false,
    auth: {
      user: 'subarnapaul@rocketmail.com',
      pass: process.env.MAIL_PASSWORD
    }
  });

  transporter.sendMail({
    from: '"Subarna Paul at ArtBox" <subarnapaul@rocketmail.com>',
    to: email,
    subject: subject,
    text: message,
    html: emailtemplate.emailBody(message)
  })
    .then(info => res.render('admin/email-success', { email, subject, message, info, buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "View Exhibtions", linkB: "/findExhibition", buttonC: "Create New Exhibition", linkC: "/exhibition/create" }))
    .catch(error => console.log(error));
});

//This sends an array of objects via res.json which can be fetched into script.js and 
//whose details can be used to generate charts on a statistics page

router.get('/statsDetails', isUserLoggedIn, isAdmin, (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
})

//This renders the page on which statistics is shown using my canvas

router.get('/statistics', isUserLoggedIn, isAdmin, (req, res) => {
  res.render('admin/gallery-stats', { buttonA: "Back To Dashboard", linkA: "/admin", buttonB: "View Exhibtions", linkB: "/findExhibition", buttonC: "Create New Exhibition", linkC: "/exhibition/create" })
})

module.exports = router;
