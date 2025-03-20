const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const router = require('./public/src/scripts/router');

// Ruta para servir el HTML
app.use(express.json());
app.use(router);
app.use(express.static('app'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/views', express.static('views'));



app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
