import express from 'express';
import config from './config.js';
import routeruser from './routes/user.routes.js';
import routerempresa from './routes/empresa.routes.js';
import routergrupos from './routes/grupos.routes.js';
import routerempresacategoria from './routes/empresacategoria.routes.js';
import './database/relationships.js';
import cors from 'cors';
import fileUpload from 'express-fileupload';


const app = express();

// Settings
app.set('PORT', config.PORT);
app.set('DB_NAME_USER', config.DB_NAME_USER);
app.set('DB_PASSWORD', config.DB_PASSWORD);
app.set('DB_PORT', config.DB_PORT);
app.set('DB_NAME_SCHEMA', config.DB_NAME_SCHEMA);
app.set('DB_SERVER', config.DB_SERVER);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload({
    createParentPath: true // Crear carpeta de almacenamiento de archivos.
}));

app.use(routeruser);
app.use(routerempresa);
app.use(routergrupos);
app.use(routerempresacategoria);

export default app