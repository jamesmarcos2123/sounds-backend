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
module.exports = router;