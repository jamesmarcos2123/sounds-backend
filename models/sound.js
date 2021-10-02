const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const soundsSchema = new mongoose.Schema({
  name: {type: Email, required: true, unique: true},  
}, { 
  timestamps: true 
});

soundsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Sounds', soundsSchema);