require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express()

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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