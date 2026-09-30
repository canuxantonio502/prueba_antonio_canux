const express = require('express');
const router = express.Router();

const { crearPostulacion } = require('../controllers/postulacionesController');

router.post('/', crearPostulacion);

module.exports = router;

