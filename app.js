var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    express             = require("express"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    expressSanitizer    = require("express-sanitizer"),
    app                 = express(),
        // seedDB      = require("./seeds")


// ===== MODELS =====

var Gym     = require('./models/gym'),
    User    = require('./models/user'),
    Comment = require('./models/comment')


var commentRoutes       = require("./routes/comments");


mongoose.connect("mongodb://localhost/teretane-proba");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

seedDB();

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Once again Rusty wins",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


// ========= MANIUAL DATABASE INJECTION =======

// Gym.create ({
//    name: "FITNES KLUB BLOK",
//    phone: "063 1 9999 88",
//    street: "Novi Beograd",
//    area: "12",
//    city: "Beograd",
//    lat: 44.820652784889184,
//    lng: 20.37655166070556,
//    comments: {
//     text: "bsdasda",
//     author: "dsds"
//    }
   
// });

// ========== INDEX ROUTE ============
app.get("/", function(req, res) {
    res.redirect("/index");
});

app.get("/index", function (req, res){
    Gym.find({}, function (err, gyms){
        if (err) {
            console.log(err);
        } else {
   
              res.render("gyms/index", {gyms:gyms}); 
        }
    });
   
});

// ========== NEW ROUTE =============

app.get("/index/new", isLoggedIn, function(req, res){
    res.render("gyms/new");
});


// ========== CREATE ROUTE ==========

app.post("/index", isLoggedIn ,function(req, res){
    req.body.gym.body = req.sanitize(req.body.gym.body);
    Gym.create(req.body.gym, function(err, newGym){
        if(err){
            res.render("gyms/new");
        } else {
            res.redirect("/index");
        }
    });
});

// ========== SHOW ROUTE ============

app.get("/index/:id", function(req, res){
    Gym.findById(req.params.id, function(err, foundGym){
        if (err){
            res.redirect ("/index");
        } else {
            res.render("gyms/show", {gym:foundGym});
        }
    });
});

// ========== EDIT ROUTE =============

app.get("/index/:id/edit", isLoggedIn, function(req, res){
   Gym.findById(req.params.id, function(err, foundGym){
       if (err){
           res.redirect("/index");
       } else {
           res.render("gyms/edit", {gym:foundGym});
       }
   });
});


// ========== UPDATE ROUTE ==========

app.put("/index/:id", function(req, res){
    req.body.gym.body = req.sanitize(req.body.gym.body);
    Gym.findByIdAndUpdate(req.params.id, req.body.gym, function(err, updatedGym){
        if (err) {
            res.redirect("/index")
        } else {
            res.redirect("/index/" + req.params.id)
        }
    });
});



// ========== DELETE ROUTE ==========

app.delete("/index/:id", isLoggedIn, function(req, res){
    Gym.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    });
});



//show register form
app.get('/register', function(req, res) {
    res.render('register')
});

// handle sign up logic

app.post('/register', function(req, res) {
    
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/index');
        });
    });
});

// show login form

app.get('/login', function(req, res) {
    res.render('login');
});


app.post('/login', passport.authenticate('local',
{
    successRedirect:'/index',
    failureRedirect:'/login'
    
}), function(req, res) {
    

});

//  LOGOUT route

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/index');
});





app.use('/index/:id/comments', commentRoutes);


// Middleware
function isLoggedIn (req, res, next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// ========== SERVER LISTEN ==========

app.listen(3000, function () {
  console.log('Listening on port 3000!')
});