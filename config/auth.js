module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  },

  levelGold: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.points >= 100) { 
        return next();
      } else {
        res.render("unqualified", {
          user: req.user
        });
      }
    }
    res.redirect("/users/login");
  }
};