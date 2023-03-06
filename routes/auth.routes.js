// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {
  isUserLoggedIn,
  isUserLoggedOut,
} = require('../middleware/route-guard');


router.get('/userSignup',isUserLoggedOut,(req, res, nex) => res.render('auth/user-signup'));

router.post('/userSignup',isUserLoggedOut, (req, res, next) => {
    const { username, email, password, role } = req.body;

    console.log(req.body)
   


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
            console.log('Newly created user is: ', userFromDB);
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

router.get('/user',isUserLoggedIn, (req, res) => {

  if(req.session.currentUser.role === "visitor"){
    res.render('landing', { userInSession: `Welcome ${req.session.currentUser.username}`, linkA:`/visitor`, buttonA:`Visitor Dashboard`,buttonB: `Artist Dashboard`, buttonC: `Admin Dashboard`})
  }

  else if(req.session.currentUser.role === "artist"){
    res.render('landing', { userInSession: `Welcome ${req.session.currentUser.username}`,linkA:`/visitor`, buttonA:`Visitor Dashboard`, linkB:`/artist`, buttonB: `Artist Dashboard`, buttonC: `Admin Dashboard`})
  }

  else if(req.session.currentUser.role === "admin"){
    res.render('landing', { userInSession: `Welcome ${req.session.currentUser.username}`, linkA:`/visitor`, buttonA:`Visitor Dashboard`,linkB:`/artist`, buttonB: `Artist Dashboard`, linkC:`/admin`, buttonC: `Admin Dashboard`})
  }
  ;
})

router.get('/login', isUserLoggedOut,(req, res, next) => {
  res.render('auth/user-login')
 // .catch((err)=> next(err))
});

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
        res.render('auth/user-login', { errorMessage: 'Email is not registered. Try with other email.' });
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

router.post('/userLogout', isUserLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  })
});

/*

// GET route to add User's details (Role, Age, etc...)
router.get('/user/:id', isUserLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      if (req.session.currentUser.role == "visitor") {
        res.render('visitor')
      }
    })
  res.render('auth/user-login')
})

//POST route to add Users details (Role, Age, etc...)
router.post('/landing', isUserLoggedIn,(req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { role, age, gender, nationality,  } = req.body;

  User.findOneAndUpdate({ email })
    .then(user => {

})
.catch(error => next(error));
*/





module.exports = router;