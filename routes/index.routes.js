const express = require('express');
const router = express.Router();
const Exhibition = require('../models/Exhibition.model')

//All the open routes accessible by anyone, are on this route.
/* GET home page */

router.get("/", (req, res, next) => {
    res.render("index", {message:"Welcome To Europe's Leading Art Gallery", image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC:`/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });
});

/* GET route to Fine Art Page*/
//Search forms are pre-filled only with the exhibitions which are not archived

router.get("/fineArtImg", (req, res, next) => {
  let exhibitionArray = []
  Exhibition.find()
  .then((exhibitionToDisplay) => {
    for (let item of exhibitionToDisplay) {
        if (item.exhibitionStatus === "open" && item.archived === false) {
          exhibitionArray.push(item)
        }
    }
    res.render("fineArtImg",{ exhibitionArray, image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});
  })
    
});


/* GET route to Photography Page*/
//Search forms are pre-filled only with the exhibitions which are not archived

router.get("/photographyImg", (req, res, next) => {
  let exhibitionArray = []
  Exhibition.find()
  .then((exhibitionToDisplay) => {
    for (let item of exhibitionToDisplay) {
        if (item.exhibitionStatus === "open" && item.archived === false) {
          exhibitionArray.push(item)
        }
    }
  res.render("photographyImg", {exhibitionArray, image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});
  })
});

/* GET route to Plastic Art Page*/
//Search forms are pre-filled only with the exhibitions which are not archived

router.get("/plasticArtImg", (req, res, next) => {
  let exhibitionArray = []
  Exhibition.find()
  .then((exhibitionToDisplay) => {
    for (let item of exhibitionToDisplay) {
        if (item.exhibitionStatus === "open" && item.archived === false) {
          exhibitionArray.push(item)
        }
    }
  res.render("plasticArtImg", {exhibitionArray, image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});
  })
});

//Search forms: on clicking search, it looks for the specific exhibition in the data base and renders them on the search page

router.post('/search', (req, res) => {
  const { exhibitionName } = req.body;
  Exhibition.findOne({exhibitionName})
  .then((displayedExhibition) => {
    res.render('search-results', {displayedExhibition})
  })
})

//Finds the exhibition by artType and renders it

router.post('/searchArtType', (req, res) => {
  const {artType} = req.body;
  let exhibitionsArray = []
  let applicationsArray = []
  Exhibition.find()
  .then((exhibitionsArr) => {
      for(let exhibition of exhibitionsArr) {
        for(let application of exhibition.artistApplication)
        {if (application.artType === artType &&
          exhibition.exhibitionStatus === "open" && exhibition.archived === false) {
          exhibitionsArray.push(exhibition)
          applicationsArray.push(application)
        }}
      }
      res.render('search-artType', {exhibitionsArray, applicationsArray})
  })
})

router.get("/fineArtBlog", (req, res, next) => {

  res.render("fineArtBlog");
});

router.get("/photographyBlog", (req, res, next) => {

  res.render("photographyBlog");
});

router.get("/plasticArtBlog", (req, res, next) => {

  res.render("plasticArtBlog");
});


module.exports = router;
