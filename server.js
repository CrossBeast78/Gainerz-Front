const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir la carpeta "public" como estática
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para las vistas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/LandingPage/index.html'));
});

app.get('/nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/LandingPage/nosotros.html'));
});

app.get('/contactos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/LandingPage/contactos.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/Login-Register/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/Login-Register/register.html'));
});

// Rutas para la app
app.get('/bandeja', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/App/bandeja.html'));
});

app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/App/calendar.html'));
});

app.get('/cuentas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/App/cuentas.html'));
});

app.get('/gyms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/App/gyms.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/App/perfil.html'));
});

// Middleware para manejar rutas no definidas (evita Cannot GET)
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
