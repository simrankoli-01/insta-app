const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../keys");
const User = require("../models/auth");
const post = require('../models/post');

// Middleware to check if the user is logged in
const requirelogin = (req, res, next) => {
    const bearerheader = req.headers['authorization'];
    if (!bearerheader) {
             res.status(401).json({ 
            message: "Authorization header missing" });
    }

    const bearer = bearerheader.split(' ');
    const token = bearer[1];
    jwt.verify(token, SECRETKEY, (err, payload) => {
         
        if (err) {
            return res.status(403).json({ meassage: `please login first ${err}`});
        }
        const { _id } = payload;
        User.findById(_id)
            .then((dbuser) => {
                if (!dbuser) {
                    return res.status(404).json({ error: "User not found" });
                }
                req.user = dbuser; 
                next(); 
            })
            .catch((err) => res.status(500).json({ error: "Database error" }));
    });
};

module.exports = requirelogin;