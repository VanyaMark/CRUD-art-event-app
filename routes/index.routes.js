const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {

  res.render("index", {message:"Welcome to ArtBox", image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg', linkA: `/fineArtImg`, linkB: `/photographyImg`, linkC:`/plasticArtImg`, buttonA: `Fine Art`, buttonB: `Photography`, buttonC: `Plastic Art` });

});

/* GET route to Fine Art Page*/
router.get("/fineArtImg", (req, res, next) => {

  res.render("fineArtImg", {image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});

});

/* GET route to Photography Page*/
router.get("/photographyImg", (req, res, next) => {

  res.render("photographyImg", {image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});
});

/* GET route to Plastic Art Page*/
router.get("/plasticArtImg", (req, res, next) => {

  res.render("plasticArtImg", {image1: '../images/slider-1.jpg', image2: '../images/slider-2.jpg', image3: '../images/slider-3.jpg', image4:'../images/slider-4.jpg'});
});


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
