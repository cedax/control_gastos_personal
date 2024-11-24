const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Carpeta donde estarán las vistas

// Middleware para manejar el parsing de datos JSON y URLencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (como imágenes) de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Servir archivos estáticos de la carpeta js
app.use('/js', express.static(path.join(__dirname, 'js')));
// Servir archivos estáticos de la carpeta css
app.use('/css', express.static(path.join(__dirname, 'css')));

// Ruta para mostrar el formulario de carga de imágenes
app.get('/', (req, res) => {
    res.render('dashboard');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
