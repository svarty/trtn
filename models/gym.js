var mongoose = require('mongoose')

var gymSchema = new mongoose.Schema({
name: String,
phone: String,
street: String,
area: String,
city: String,
lat: Number,
lng: Number,
author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
        username: String
    },
    
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
                
            }
        
        
        ]
})

module.exports = mongoose.model("Gym", gymSchema);