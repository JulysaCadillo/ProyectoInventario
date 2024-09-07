const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const inventoryRoute = require("./Inventory");
const userRoute = require("./User");
const ordersRoute = require("./Orders");
const accountRoute = require("./Account");

router.use((req, res, next) => {
    // Recuperar token del encabezado
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ message: "Authorizacion denegada" });

    try {
        const decoded = jwt.verify(token, process.env.SECRETKEY);

        // Adjunte información de usuario decodificada para solicitar el objeto
        req.user = decoded;
        
         // Continuar hacia la ruta protegida.
        next();
    } catch (err) {
        res.status(401).json({ message: "El token no es válido" });
    }
});

// CONFIGURACIÓN DE RUTA PARA TODAS LAS RUTAS QUE REQUIEREN AUTORIZACIÓN
router.use("/inventory", inventoryRoute);
router.use("/user", userRoute);
router.use("/orders", ordersRoute);
router.use("/account", accountRoute);

module.exports = router;
