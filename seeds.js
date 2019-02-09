var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "La Ceiba",
        image: "http://www.destination360.com/central-america/honduras/images/s/la-ceiba-honduras.jpg",
        description: "Prueba prueba prueba"
    },
    {
        name: "San Pedro Sula",
        image: "https://rubenescobar.files.wordpress.com/2008/10/4.jpg",
        description: "Prueba prueba prueba2"
    },
    {
        name: "Trujillo",
        image: "http://media-cdn.tripadvisor.com/media/photo-s/05/d2/49/8d/fortaleza-de-santa-barbara.jpg",
        description: "Prueba prueba prueba3"
    }
];

function seedDB() {
    // Remove all Campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        //add some campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    Comment.create(
                        {
                            text: "Text, this.",
                            author: "Jorge"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();
                                console.log("created new comment");
                            }
                        });
                }
            });
        });
        //add comments
    });
}

module.exports = seedDB;
