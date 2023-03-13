//ensures a page can only be accessed if a user is logged in

const isUserLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/login");
    }
    next();
  };
  
//ensures the page can only be accessed when a user is logged out

  const isUserLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
      return res.redirect("/");
    }
    next();
  };
  
//ensures only admin can access the page

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
  
  //ensures only artist or admin can access the page
  
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
  
  module.exports = {
    isUserLoggedIn,
    isUserLoggedOut,
    isAdmin,
    isArtistOrAdmin
  };
  