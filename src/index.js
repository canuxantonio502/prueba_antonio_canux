const express = require('express');
require('dotenv').config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Importar y usar las rutas
const applicationsRoutes = require('./routes/applications');

app.use('/applications', applicationsRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});