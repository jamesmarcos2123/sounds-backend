const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const soundsSchema = new mongoose.Schema({
  nome: {type: String, unique: true},
  frequencia: {type: Number},
  classificacao:{
    type: String,
    enum : ['leve', 'medio', 'pesado'],
  },
  categoria: {type: String} 
}, { 
  timestamps: true 
});

soundsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Sounds', soundsSchema);