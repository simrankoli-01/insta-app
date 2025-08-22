const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const requirelogin = require("../middleware/requirelogin");
const user = require('../models/auth');

// Route to create a post
router.post('/createpost', requirelogin, async (req, res) => {
    const { title, body, photos } = req.body;
    if (!title || !body || !photos) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }
    else{
    const post = new Post({
        title: title,
        body: body,
        photos: photos,
        postedBy: req.user,
    });
    // Save the post to the database
   await post.save()
            res.status(201).json({
                message: "post created successfully",});
            }
        })

// Route for gett myposts
router.get('/mypost',async (re, res) => {
    const myposts = await Post.findOne();
    res.status(200).json({myposts})
});

// Route to get all posts
router.get('/allpost', async (req, res) => {
    const allposts = await Post.find();
    res.status(200).json({ allposts });
});


module.exports = router;

