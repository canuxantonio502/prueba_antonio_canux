const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente' 
    });
});

const PORT = process.env.PORT || 3000;

// Levantamos  el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});