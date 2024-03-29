// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const ArtistApplication = require('../models/ArtistApplication.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const nodemailer = require('nodemailer')
const emailtemplate = require('../templates/email')
const PORT = process.env.PORT || 3000;
const {
  isUserLoggedIn,
  isUserLoggedOut,
} = require('../middleware/route-guard');

//renders the page on which the sign-up form is found

router.get('/userSignup', isUserLoggedOut, (req, res, nex) => res.render('auth/user-signup', { linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` }));

//accepts details from the sign-up form and sends to database for storage only if they are valid

router.post('/userSignup', isUserLoggedOut, (req, res, next) => {
  const { username, email, password, role } = req.body;

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/user-signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      if (!username || !email || !password) {
        res.render('auth/user-signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
        return;
      }
      else {
        return User.create({
          username,
          email,
          passwordHash: hashedPassword,
          role
        })
          .then(userFromDB => {
            res.redirect('/login')
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/user-signup', { errorMessage: error.message, linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
            }
            else if (error.code === 11000) {
              res.status(500).render('auth/user-signup', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art`
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

router.get('/user', isUserLoggedIn, (req, res) => {

  if (req.session.currentUser.role === "visitor") {
    res.render('landing', { userInSession: `Select your dashboard.`, linkA: `/visitor`, buttonA: `Visitor`, buttonB: `Artist`, buttonC: `Admin` })
  }

  else if (req.session.currentUser.role === "artist") {
    res.render('landing', { userInSession: `Select your dashboard.`, linkA: `/visitor`, buttonA: `Visitor`, linkB: `/artist`, buttonB: `Artist`, buttonC: `Admin` })
  }

  else if (req.session.currentUser.role === "admin") {
    res.render('landing', { userInSession: `Select your dashboard.`, linkA: `/visitor`, buttonA: `Visitor`, linkB: `/artist`, buttonB: `Artist`, linkC: `/admin`, buttonC: `Admin` })
  }
  ;
})

//Log in route only renders when user is logged out

router.get('/login', isUserLoggedOut, (req, res, next) => {
  res.render('auth/user-login', { linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` })
});

//Log in details are accepted from the from and compared with the database

router.post('/user', isUserLoggedOut, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/user-login', {
      errorMessage: 'Please enter both, email and password to login.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art`
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/user-login', { errorMessage: 'Email not found. Try with a different email or, register with us by signing up', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/user');
      } else {
        res.render('auth/user-login', { errorMessage: 'Incorrect password.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
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

// Change username, email or password GET route
router.get('/usernameEmailUpdate', isUserLoggedIn, (req, res, nex) => {
  const user = req.session.currentUser._id
  User.findById(user)
    .then(userFromDB => {
      res.render('artist/username-email-password-update', { userFromDB, linkA: `/artist`, linkB: `/artistFavourites`, linkC: `/artistApplication`, buttonA: `Back To Dashboard`, buttonB: `Favourites`, buttonC: `Apply for Exhibition` })
    })
});


// Change username, email or password POST route

router.post('/usernameEmailUpdate', isUserLoggedIn, (req, res, next) => {
  const { username, email, password } = req.body;
  const user = req.session.currentUser._id;

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('artist/username-email-password-update', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.', linkA: `/artist`, linkB: `/artistFavourites`, linkC: `/artistApplication`, buttonA: `Back To Dashboard`, buttonB: `Favourites`, buttonC: `Apply for Exhibition` });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      if (!username || !email || !password) {
        res.render('artist/username-email-password-update', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.', linkA: `/artist`, linkB: `/artistFavourites`, linkC: `/artistApplication`, buttonA: `Back To Dashboard`, buttonB: `Favourites`, buttonC: `Apply for Exhibition` });
        return;
      }
      else {
        return User.findByIdAndUpdate(user, {
          username,
          email,
          passwordHash: hashedPassword,
        })
          .then(userFromDB => {
            res.redirect('/artist')
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('artist/username-email-password-update', { errorMessage: error.message, linkA: `/artist`, linkB: `/artistFavourites`, linkC: `/artistApplication`, buttonA: `Back To Dashboard`, buttonB: `Favourites`, buttonC: `Apply for Exhibition` });
            }
            else if (error.code === 11000) {
              res.status(500).render('artist/username-email-password-update', {
                errorMessage: 'Username and email need to be unique. Either username or email is already used.', linkA: `/artist`, linkB: `/artistFavourites`, linkC: `/artistApplication`, buttonA: `Back To Dashboard`, buttonB: `Favourites`, buttonC: `Apply for Exhibition`
              })
            }
            else {
              next(error);
            }
          })
      }
    })
});

//Renders a form to enter email if someone forgets their password

router.get('/forgotPassword', isUserLoggedOut, (req, res, next) => {
  res.render('auth/enter-email-password-reset', { linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` })
})

/* This emails a password reset link to the user so they can paste it on their browser's address bar to access
the form where they can enter their new password. Most probably not the safest way to do this as the users 
receive the same link everytime. More security is needed. However at a very basic level one can reset their 
password this way */

router.post('/resetPasswordLink', isUserLoggedOut, async (req, res, next) => {
  let { email } = req.body;

  let transporter = nodemailer.createTransport({

    host: process.env.MAIL_HOST,
    service: "yahoo",
    secure: false,
    auth: {
      user: 'subarnapaul@rocketmail.com',
      pass: process.env.MAIL_PASSWORD
    }
  });

  User.find({ email })
    .then((user) => {
      console.log(user);

      if (user.length === 0) {
        res.render('auth/enter-email-password-reset', { errorMsg: "Sorry, this email does not exist on our system.", linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` })
      }
      else {
        transporter.sendMail({

          from: '"Subarna Paul at ArtBox" <subarnapaul@rocketmail.com>',
          to: email,

          subject: 'Password Reset Link',

          text: 'Click on this link, or paste it on your address bar to go to the password link page: localhost:3001/resetPasswordLink',

          html: emailtemplate.emailBody(`Click on the following link or paste it on your browser's address bar to go to the password reset page: https://artbox.cyclic.app/resetPassword/${user[0]._id}/edit`)
        })
          .then(info => res.render('auth/check-your-email', { message: 'Check your email for link to reset your password', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` }))
      }
    });
});


//The link emailed to the user, renders the page on which they can update their password  

router.get('/resetPassword/:id/edit', isUserLoggedOut, (req, res, next) => {
  const { id } = req.params
  res.render('auth/reset-password', { id, linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` })
})

//This collects the new password and updates it on the system as well as redirects user to login page.

router.post('/resetPassword/:id/edit', isUserLoggedOut, (req, res, next) => {
  const { id } = req.params
  const { password } = req.body

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/reset-password', { id, errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      if (!password) {
        res.render('auth/reset-password', { id, errorMessage: 'Please provide your password.', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
        return;
      }
      else {
        User.findByIdAndUpdate(id, {
          passwordHash: hashedPassword,
        }, { new: true })

          .then(userFromDB => {
            console.log('Newly updated user is: ', userFromDB);
            res.redirect('/login')
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('artist/reset-password', { id, errorMessage: error.message, linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC: `/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
            }
            else {
              next(error);
            }
          })
      }
    })

})

module.exports = router;