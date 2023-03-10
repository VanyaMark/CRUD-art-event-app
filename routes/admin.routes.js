const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const mongoose = require('mongoose');
const {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin
  } = require('../middleware/route-guard');

  router.get('/drones/create', (req, res, next) => {
    // Iteration #3: Add a new drone
    res.render('drones/create-form.hbs')
  });
  router.post('/drones/create', (req, res, next) => {
    // Iteration #3: Add a new drone
    console.log(req.body);
    const {name, propellers, maxSpeed} = req.body;
    Drone.create({name, propellers, maxSpeed})
    .then(()=> res.redirect('/drones'))
    .catch(error => next(error))
  });

  router.get('/drones', (req, res, next) => {
    // Iteration #2: List the drones
    Drone.find()
    .then(allTheDronesFromDB=>{
      console.log(`Retrieved drones from DB:`, allTheDronesFromDB)
      res.render(`drones/list.hbs`,{drones: allTheDronesFromDB});
    })
    .catch(err=>{
      console.log(`Error while getting drones from DB`, err);
      next(err)
    })
  });

  router.post('/drones/:id/edit', (req, res, next) => {
    // Iteration #4: Update the drone
    const {id}= req.params;
    const {name, propellers, maxSpeed} = req.body
    Drone.findByIdAndUpdate(id, {name,propellers,maxSpeed},{new:true})
    .then(updatedDrone => res.redirect(`/drones`))
    .catch(error=>next(error))
  });
  router.post('/drones/:id/delete', (req, res, next) => {
    // Iteration #5: Delete the drone
    const {id}= req.params;
    Drone.findByIdAndDelete(id)
    .then(()=>res.redirect('/drones'))
    .catch(error=>next(error))
  });
  
  

module.exports = router;