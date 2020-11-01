const express = require('express')

const app = express()


app.use(require('./usario.routes'));
app.use(require('./login.routes'));
app.use(require('./categoria.routes'));
app.use(require('./producto.routes'));




module.exports = app;