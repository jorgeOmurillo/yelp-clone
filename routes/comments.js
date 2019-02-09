var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment.js");
var middleware  = require("../middleware/index.js");

//New comments
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find camopground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Create comments
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "A mistake happened.");
                    console.log(err);
                } else {
                    if (comment.text === "") {
                        req.flash("error", "Comment cannot be empty!");
                        res.redirect("/campgrounds/" + campground._id);
                    } else {
                        //add username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //save comment
                        comment.save();
                        console.log("Jorge mira aqui " + comment.text);
                        campground.comments.push(comment._id);
                        campground.save();
                        req.flash("success", "Successfully added the comment.");
                        res.redirect("/campgrounds/" + campground._id);
                    }
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err || !foundComment) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
