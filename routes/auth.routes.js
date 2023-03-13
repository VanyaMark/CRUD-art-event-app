// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const ArtistApplication = require('../models/ArtistApplication.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {
  isUserLoggedIn,
  isUserLoggedOut,
} = require('../middleware/route-guard');

//renders the page on which the sign-up form is found

router.get('/userSignup',isUserLoggedOut,(req, res, nex) => res.render('auth/user-signup'));

//accepts details from the sign-up form and sends to database for storage only if they are valid

router.post('/userSignup',isUserLoggedOut, (req, res, next) => {
    const { username, email, password, role } = req.body;

       const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/user-signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        if (!username || !email || !password) {
          res.render('auth/user-signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
          return;
        }
        else{
          return User.create({
            username,
            email,
            passwordHash: hashedPassword,
            role
          })
          .then(userFromDB => {
            res.redirect('/user')
          })
          .catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/user-signup', { errorMessage: error.message });
            } 
            else if (error.code === 11000) {
              res.status(500).render('auth/user-signup', {
                 errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              })
            }
            else {
                next(error);
            }
          })
        }
      })
  });

//on successful login, user is taken to a landing page from which they can go to either the
//visitor dashboard, artist dashboard or admin dashboard, depending on their role

router.get('/user',isUserLoggedIn, (req, res) => {

  if(req.session.currentUser.role === "visitor"){
    res.render('landing', { userInSession: `Please click on one of the following to access your dashboard.`, linkA:`/visitor`, buttonA:`Visitor`,buttonB: `Artist`, buttonC: `Admin`})
  }

  else if(req.session.currentUser.role === "artist"){
    res.render('landing', { userInSession: `Please click on one of the following to access your dashboard.`,linkA:`/visitor`, buttonA:`Visitor`, linkB:`/artist`, buttonB: `Artist`, buttonC: `Admin`})
  }

  else if(req.session.currentUser.role === "admin"){
    res.render('landing', { userInSession: `Please click on one of the following to access your dashboard.`, linkA:`/visitor`, buttonA:`Visitor`,linkB:`/artist`, buttonB: `Artist`, linkC:`/admin`, buttonC: `Admin`})
  }
  ;
})

//Log in route only renders when user is logged out

router.get('/login', isUserLoggedOut,(req, res, next) => {
  res.render('auth/user-login')
});

//Log in details are accepted from the from and compared with the database

router.post('/login', isUserLoggedOut,(req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/user-login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/user-login', { errorMessage: 'Email not found. Try with a different email or, register with us by signing up' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
      
        res.redirect('/user');
      } else {
        res.render('auth/user-login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

//Logout route only renders when user is logged in

router.post('/userLogout', isUserLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  })
});

module.exports = router;