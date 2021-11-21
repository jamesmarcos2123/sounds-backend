const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const VALIDADE_TOKEN = parseInt(process.env.VALIDADE_TOKEN);
const BCRYPT_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

const encripta = async (texto) => {
  return await bcrypt.hash(texto, BCRYPT_SALT_ROUNDS);
};

const compara = async (texto, textoEncriptado) => {
  return bcrypt.compare(texto, textoEncriptado);
};

/*
 * Função que cria um token JWT usando um usuário como payload.
 */
const criaToken = (usuario) => {
  let payload = {
    id: usuario._id,
    email: usuario.email
  };

  let token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: VALIDADE_TOKEN
  });

  return token;
};

/* 
 * Função de middleware que deve ser chamada antes das requisições a backends
 * que só possam ser acessados por usuários autenticados.
 */
const isAutenticado = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ 
      auth: false, 
      message: 'Não foi encontrado o token no cabeçalho da requisição.'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) { // se o token é inválido
      return res.status(500).send({ 
        auth: false, 
        message: 'Token inválido.' 
      });
    } else { // se o token é válido
      User.findById(decoded.id, (err, usuario) => {
        req.usuario = usuario;
        next();
      });
    }
  });
};

const hasRole = (role) => {
  return (req, res, next) => {
    if (req.usuario.role === role) {
      next();
    } else {
      return res.status(401).send({ 
        auth: false, 
        message: 'Você não tem autorização para acessar esse recurso'
      });
    }
  };
};

const validaLogin = async (usuario, senha) => {
  if (!usuario) {
    throw 'Não foi encontrado um usuário com o email informado!';
  } else if (await bcrypt.compare(senha, usuario.senha)) {
    
  } else {
    throw 'Senha inválida!';
  }
};

const podeAcessar = (roles) => {
  return (req, res, next) => {
    let pode = false;

    roles.forEach((role) => {
      if (req.usuario.role === role) {
        pode = true;
      }
    });

    if (pode) {
      next();
    } else {
      res.status(403).send({auth: false, message: 'Você não tem autorização para acessar esse recurso'});
    }
  };
};
module.exports = {
  encripta,
  compara,
  criaToken,
  isAutenticado,
  validaLogin,
  hasRole,
  podeAcessar
};