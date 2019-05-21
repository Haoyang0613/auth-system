const express = require("express");
const router = express.Router();
const auth = require("../config/auth");
const User = require("../models/User");

// Home Page
router.get("/home", (req, res) => res.redirect("")); // Add homepage url

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));

// Chat App
// router.get("/chat", ensureAuthenticated, (req, res) => 
//   res.render("chat", {
//     user: req.user
//   })
// );

// Chat Maintenance
router.get("/chat", auth.levelGold, (req, res) => 
  res.render("maintenance")
 );

// Dashboard
router.get("/dashboard", auth.ensureAuthenticated, (req, res) => {
  //console.log(req.user.email);
  User.findOne({ email: req.user.email }, function(err, foundOb) {
    //console.log(foundOb);
    // foundOb.points = foundOb.points + 1;
    // foundOb.save();
    
    res.render("dashboard", {
      user: foundOb
    });

  });
});

module.exports = router;