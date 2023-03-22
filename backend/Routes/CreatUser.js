const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Await } = require('react-router-dom');
const jwtSecret = "MynameisManhAnh$#"

router.post("/creatuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salf = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salf)

        try {
            await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            }).then(res.json({ sucess: true }))


        } catch (error) {
            console.log(error)
            res.json({ sucess: false });
        }
    })

router.post("/loginuser", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })]
    // , 'Incorrect Password'
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let email = req.body.email;

        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Tài khoản không tồn tại" });
            }


            const pwdCompare = bcrypt.compare(req.body.password, userData.password)
            if (!pwdCompare) {
                return res.status(400).json({ errors: "Sai mật khẩu" });
            }

            const date = {
                user: {
                    id: userData.id
                }
            }
            const authToken = jwt.sign(date, jwtSecret)
            return res.json({ sucess: true, authToken: authToken })


        } catch (error) {
            console.log(error)
            res.json({ sucess: false });
        }
    })

module.exports = router;