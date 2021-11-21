const express = require('express');
const router = express.Router();
const Email = require('../services/email_service');
const nodemailer = require('nodemailer');
const User = require('../models/user');

router.post('/', async (req, res) => {
    var user = await User.findOne({email: req.body.email})
    if(!user) {
        res.status(404).json({error: 'Email não encotrado'})
    }
    Email.sendEmail(req.body.email, user);
    return res.status(200).json({success: true})
  });



module.exports = router;
