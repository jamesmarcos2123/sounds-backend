const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Email = require('mongoose-type-email');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  email: {type: Email, required: true, unique: true},
  senha: {type: String, required: true},
  role: {
    type: String,
    enum : ['adm', 'user', 'vip'],
    default: 'user'
  }  
}, { 
  timestamps: true 
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);