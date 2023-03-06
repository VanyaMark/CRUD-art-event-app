// checks if the user is logged in when trying to access a specific page
const isUserLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/login");
    }
    next();
  };
  
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isUserLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect("/");
    }
    next();
  };
  
  const isAdmin = (req, res, next) => {
  
    if(req.session.currentUser.role != "admin")
    {
      return res.redirect("/landing");
    }
    else
    {
      next()
    }
  }
  
  const isArtistOrAdmin = (req, res, next) => {
  
    if(req.session.currentUser.role != "artist" && req.session.currentUser.role != "admin")
    {
      return res.redirect("/landing");
    }
    else
    {
      next()
    }
  }




  // export the functions to make them available to be used wherever we need them
  // (we just need to import them to be able to use them)
  
  module.exports = {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  };
  