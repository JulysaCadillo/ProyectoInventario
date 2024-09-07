// importaciones de módulos
const express = require("express");
const app = express();
var cors = require('cors')
const bodyParser = require("body-parser");
const port = process.env.port || 4000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
// ARCHIVOS DE RUTA
const authRoute = require("./src/routes/Auth");
const loginRoute = require("./src/routes/Login");
const signupRoute = require("./src/routes/Signup");
const categoriesRoute = require("./src/routes/Categories");
const supplierRoute = require("./src/routes/Supplier");

// CONFIGURACIÓN DE RUTA | TODAS LAS RUTAS QUE NO REQUIEREN AUTORIZACIÓN PARA ACCEDER
app.use("/api/auth", authRoute);
app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/supplier", supplierRoute);

// ruta administrativa
app.get("/admin", (req, res)=>{
    sess = req.session;

    if(!sess.user){
        res.redirect("/login");
        return;
    }
    else if(sess.user.role === 2){
        res.redirect("/inventory");
        return;
    }
});

// manejo de errores de estado
app.use((req, res)=>{
    res.status(404).json({message:"Invalid route"});
})

// escucha del puerto de la aplicación
app.listen(port, (err)=>{
    if(err) return console.log(err);
    console.log(`Server up running at 'http://localhost:${port}/'`);
})