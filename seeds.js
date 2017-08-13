var mongoose = require("mongoose");
var Gym = require("./models/gym");
var Comment   = require("./models/comment");

var data = [
{
    name: "Gym 1",
    phone: "12345678",
    street: "Some Street 1",
    area: "12",
    city: "City Name",
    lat: 44.790661,
    lng: 20.452378,
},
{
    name: "Gym 2",
    phone: "12345678",
    street: "Some Street 1",
    area: "12",
    city: "City Name",
    lat: 44.790661,
    lng: 20.452378,
}
]

function seedDB(){
   //Remove all campgrounds
   Gym.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed Gym!");
         //add a few campgrounds
         data.forEach(function(seed){
            Gym.create(seed, function(err, gym){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a gyms");
                    //create a comment
                    Comment.create(
                    {
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            gym.comments.push(comment);
                            gym.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
     }); 
    //add a few comments
}

module.exports = seedDB;