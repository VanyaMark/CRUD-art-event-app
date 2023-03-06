const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {

  res.render("index", {message:"Welcome to ArtBox"});

});

module.exports = router;
