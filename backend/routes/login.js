const express = require("express");
const router = express.Router();
const db = require("../models/database");

// LOGIN
router.post("/", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, user) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (!user) {

                return res.json({
                    success: false,
                    message: "Invalid Email or Password"
                });

            }

            res.json({
                success: true,
                user
            });

        }
    );

});

module.exports = router;