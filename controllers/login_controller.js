const express = require('express');
const router = express.Router();
const Security = require('../services/security_service');
const User = require('../models/user');


router.post('/', async (req, res) => {
  let user = await User.findOne({email: req.body.email});

  try {
    await Security.validaLogin(user, req.body.senha);

    let token = Security.criaToken(user);
    res.status(200).json({ auth: true, token, role: user.role , email: user.email});
  } catch (erro) {
    res.status(401).json({ auth: false, erro });
  }
});

module.exports = router;