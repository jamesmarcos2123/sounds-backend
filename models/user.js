const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Email = require('mongoose-type-email');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
  email: {type: Email, required: true, unique: true},
  senha: {type: String, required: true},
  bloqueado: {type: Boolean, default: false},
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