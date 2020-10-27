require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express()

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));


// Habilitar la carpeta public
// El path ayuda a que el path se arme correctamente
// app.use(express.static(path.resolve(__dirname, '../public')));



// Rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})