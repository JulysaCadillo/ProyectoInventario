const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");
const jwt = require("jsonwebtoken");

/**
 * @openapi
 * tags:
 *   - name: Autenticación
 *     description: Operaciones relacionadas con la gestión de usuarios
 */

/**
 * @openapi
 * /api/signup:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar un nuevo usuario
 *     description: Permite a un nuevo usuario registrarse en la aplicación y genera un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Registro exitoso y token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sign up successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error message from the server"
 *       500:
 *         description: Error en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error message from the server"
 */
router.post("/", (req, res) => {
    query(
        "INSERT INTO user (email, permission, first_name, last_name, password, phone) VALUES (?, 1, ?, ?, ?, ?)",
        [
            req.body.email,
            req.body.firstName,
            req.body.lastName,
            req.body.password,
            req.body.phone,
        ],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.affectedRows > 0) {

                    // Create a JWT token
                    const token = jwt.sign({
                        email: req.body.email,
                        permission: 2,
                        last_name: req.body.lastName,
                    }, process.env.SECRETKEY, {expiresIn: "24h",});

                    return res.status(200).send({
                        success: true,
                        message: "Registrado exitosamente",
                        token
                    });
                }
            }
        }
    );
});

module.exports = router;
