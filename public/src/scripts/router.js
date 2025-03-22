const express = require('express');
const path = require('path');
const router = express.Router();



// Ruta para servir el HTML
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/index.html")));
router.get('/login', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/Login-Register/login.html")));
router.get('/register', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/Login-Register/register.html")));
router.get('/register2', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/Login-Register/registro_detallado.html")));
router.get('/bandeja', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/App/bandeja.html")));
router.get('/calendar', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/App/calendar.html")));
router.get('/cuentas', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/App/cuentas.html")));
router.get('/gyms', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/App/gyms.html")));
router.get('/perfil', (req, res) => res.sendFile(path.resolve(__dirname + "/../../Views/App/perfil.html")));
router.get('/contactos', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/contactos.html")));
router.get('/nosotros', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/nosotros.html")));
router.get('/solicitudes', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/bandeja-solicitudes.html")));
router.get('/notificaciones', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/App/bandeja.html")));
router.get('/otros', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/bandeja_otros.html")));
router.get('/anuncios', (req, res) => res.sendFile(path.resolve(__dirname + "/../../views/LandingPage/bandeja_anuncios.html")));

module.exports = router;