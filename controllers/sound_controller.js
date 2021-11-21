const express = require('express');
const router = express.Router();
const Security = require('../services/security_service');
const Sound = require('../models/sound');

router.get('/', async (req, res) => {
    res.json(await Sound.find()); 
  });

  router.get('/:id', Security.isAutenticado, findId, async (req, res) => {
    res.json(req.sound);
  });

  router.delete('/:id', Security.isAutenticado, findId, Security.hasRole('adm'), async (req, res) => {
    await req.sound.remove();
  });

router.post('/', Security.isAutenticado,  Security.hasRole('vip'),  async (req, res) =>  {
    try {
      var freq = getRandomIntInclusive(5000,1);
      if(freq < 1000) {
        req.body.frequencia = freq;
        req.body.classificacao = "leve"
      } else if(freq > 4000) {
        req.body.frequencia = freq;
        req.body.classificacao = "pesado"
      } else {
        req.body.frequencia = freq;
        req.body.classificacao = "medio"
      }
      const novo = await new Sound(req.body).save();
      res.status(201).json(novo);
    } catch (e) {
      res.status(500).json(e);
    }
  });

  async function findId(req, res, next) {
    try {
      req.sound = await Sound.findById(req.params.id);
      
      if (req.sound === null) {
        return res.status(404).json({ 
          message: 'Nao foi possivel encontrar um som com o id informado'
        });
      }
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  
    next();
  };


  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
module.exports = router;