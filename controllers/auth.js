const express = require("express")
const router = express.Router();
const User = require('../models/auth');
const bcrypt = require(`bcrypt`);
const requirelogin = require("../middleware/requirelogin");
//require token generator
const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../keys");


// This route will handle user registration
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username, email, password);
    if (!username || !email || !password) {
        return res.status(422).json({ message: "Please fill all the fields!!" });
    }

    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with this email" });
        } else {
            // Ensure password is a string
            bcrypt.hash((password), 12).then((hashedPassword) => {
                const user = new User({
                  username,
                  email,
                  password: hashedPassword,
                });
                user.save()
                    .then(() => {
                        res.status(201).json({ message: "User registered successfully!" });
                    })
                    .catch((err) => {
                        res.status(500).json({ error: "Failed to register user." });
                    });
            }).catch((err) => {
                res.status(500).json({ error: "Error hashing password." });
            });
        }
    }).catch((err) => {
        res.status(500).json({ error: "Database error." });
    });
});

router.post(`/login`,(req, res) => {
    const { email, password } = req.body;

    if ( !email || !password ) {
        return res.status(422).json({ message: "Please fill all the fields !!" });
    }

    User.findOne({ email: email }).then((dbuser) => {
        if (!dbuser) {
            return res.status(404).json({ error: "User is not found with this email!! Please try with another email" });
        } else {
            bcrypt.compare(password, dbuser.password).then((doMatch) => {
                if (doMatch) {
                    const token = jwt.sign({ _id: dbuser._id }, SECRETKEY);
                    res.status(200).json({ message: "Congratulations you have successfully login your account", token });
                }
                else {
                    return res.status(422).json({ error: "Invalid credentials" });
                }
            })
        }
            });
        
        })
    

router.get('/protected', requirelogin, (req, res) => {
        return res.status(200).json({ msg: " access granted" });
    })

 

module.exports = router;