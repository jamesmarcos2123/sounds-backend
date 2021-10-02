require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bd = require('./bd');

app.use(express.json()); // aceitando objetos javascript
app.use(express.urlencoded());  
app.use(cors()); // permitindo requisições de outros hosts


app.use('/login', require('./controllers/login_controller'));
app.use('/usuarios', require('./controllers/user_controller'));


console.log("Conectando ao Banco de dados");
bd.conecta(() => { 
    console.log('Conectado. Iniciando o servidor web...');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor no ar em: http://localhost:${process.env.PORT}`);
    });
  });