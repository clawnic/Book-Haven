const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    try {
        const admin =  await User.findOne({username,role: 'admin'});
        if(!admin) {
            return res.status(404).json({message: "Admin not found!"})
        }
        if(admin.password !== password) {
            res.status(401).json({message: "Invalid password!"})
        }
        
        const token =  jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(401).send({message: "Failed to login as admin"}) 
    }
});

router.post("/sync-user", async (req, res) => {
    try {
        const { email, username, displayName, photoURL } = req.body;

        // First try to find user by email
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, only update if there are changes
            const updates = {};
            if (displayName && displayName !== user.displayName) {
                updates.displayName = displayName;
            }
            if (photoURL && photoURL !== user.photoURL) {
                updates.photoURL = photoURL;
            }

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                user = await User.findOneAndUpdate(
                    { email },
                    { $set: updates },
                    { new: true }
                );
                console.log("User updated:", email);
            } else {
                console.log("User exists, no updates needed:", email);
            }

            return res.status(200).json({
                message: "User retrieved successfully",
                user
            });
        }

        // If user doesn't exist, create new user
        const newUser = new User({
            email,
            username: email.split('@')[0], // Base username
            role: 'user',
            displayName: displayName || email.split('@')[0],
            photoURL
        });

        await newUser.save();
        console.log("New user created:", email);

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Sync user error:", error);
        res.status(500).json({
            message: "Error syncing user",
            error: error.message
        });
    }
});

module.exports = router;