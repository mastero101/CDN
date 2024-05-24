const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 1001;

// Middleware to parse JSON
app.use(bodyParser.json());

// Middleware para configurar las cabeceras CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9).toString(36).substring(0, 8);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Ruta para subir archivos
app.post('/upload', upload.array('file'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }
    const fileIds = req.files.map(file => file.filename);
    res.status(200).json({ message: 'Archivos subidos exitosamente', fileIds });
});

// Ruta para obtener imágenes
app.get('/image/:imageId', (req, res) => {
    const imageId = req.params.imageId;
    const imagePath = path.join(__dirname, 'uploads', imageId);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ message: 'Imagen no encontrada' });
    }
});

// Ruta para eliminar imágenes
app.post('/delete', (req, res) => {
    const { imageId } = req.query;
    const imagePath = path.join(__dirname, 'uploads', imageId);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } else {
        res.status(404).json({ message: 'Imagen no encontrada' });
    }
});

// Ruta para obtener la lista de imágenes
app.get('/images', (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')|| file.endsWith('.mp4'));
    res.status(200).json({ images });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
