const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var socket = require("socket.io");

const app = express();

// App Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on ${PORT}`));

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false}));

// Express Session
app.use(session({
  secret: 'secretfunnygoose',
  resave: true,
  saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req , res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

// 404 Handle
app.use(function(req, res, next){
  res.status(404);
  res.render('404', { url: req.url });
});

// Socket Setup
var io = socket(server);

// Chat App
var users = [];
var connections = [];

io.on("connection", function(socket){
  connections.push(socket);

  socket.on("new-user", function(data){
    socket.username = data.username;
    users.push(socket.username);
    console.log(socket.username + " is connected");
    io.sockets.emit("new-user", { users: users });
  })

  socket.on("disconnect", function(data){
    users.splice(users.indexOf(socket.username), 1);
    connections.splice(connections.indexOf(socket), 1);
    io.sockets.emit("new-user", { users: users });
  });

  socket.on("chat", function(data){
    io.sockets.emit("chat", data);
  });
  
});

