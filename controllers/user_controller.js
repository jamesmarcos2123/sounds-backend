const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Security = require('../services/security_service');

router.get('/', async (req, res) => {
  res.json(await User.find()); 
});

router.get('/bloqueia/:id', Security.isAutenticado, Security.hasRole('adm'), findId, async (req, res) => {
  req.usuario.bloqueado = true;
  await req.usuario.save();
  res.json({mensagem: 'Usuário bloqueado com sucesso'});
});

router.get('/desbloqueia/:id', Security.isAutenticado, Security.hasRole('adm'), findId, async (req, res) => {
  req.usuario.bloqueado = false;
  await req.usuario.save();
  res.json({mensagem: 'Usuário desbloqueado com sucesso'});
});

router.get('/:id', Security.isAutenticado, findId, async (req, res) => {
  res.json(req.usuario);
});

router.post('/', async (req, res) =>  {
  const dados = req.body;
  dados.senha = await Security.encripta(dados.senha);

  try {
    const novo = await new User(dados).save();
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.delete('/:id', Security.isAutenticado, findId, async (req, res) => {
  await req.usuario.remove();
});

router.put('/:id', Security.isAutenticado, findId, async (req, res) => {
  await req.usuario.set(req.body).save();
});

// função de middleware para recuperar um usuario pelo id
async function findId(req, res, next) {
  try {
    req.usuario = await User.findById(req.params.id);
    
    if (req.usuario === null) {
      return res.status(404).json({ 
        message: 'Nao foi possivel encontrar um usuário com o id informado'
      });
    }
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }

  next();
};

module.exports = router;