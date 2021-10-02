require('dotenv').config();
const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL;


const conecta = (onConecta) => {
  mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', (error) => console.error(error));
  db.once('open', () => {
    onConecta && onConecta();
  });
};

module.exports = {
  conecta
};