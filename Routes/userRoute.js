const express = require("express");

const userRouter = express.Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { userModel } = require("../Models/userModel");

require("dotenv").config();

userRouter.post("/signup", async (req, res) => {
    const { password, email, confirm_password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({ msg: "User already Exists..." });
        } else if (password !== confirm_password) {
            res.status(400).json({ msg: "Password do not match" });
        } else if (!password) {
            res.status(400).json({ msg: "Password is required" });
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                } else {
                    const user = new userModel({ ...req.body, password: hash });
                    await user.save();
                    res.status(200).json({ msg: "User has been registered successfully....!" });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user._id }, process.env.secret)
                    res.status(200).json({ msg: "Login Successful....!", token });
                }
                else {
                    res.status(400).json({ error: "Invalid Credentials..." });
                }
            })
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = {
    userRouter,
};
