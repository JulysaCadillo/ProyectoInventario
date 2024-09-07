const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");
const jwt = require("jsonwebtoken");

/**
 * @openapi
 * tags:
 *   - name: Autenticación
 *     description: Operaciones relacionadas con la autenticación de usuarios
 */

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión utilizando su correo electrónico y contraseña.
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
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
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
 *                   example: "Request processed successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Error en la autenticación
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
 *                   example: "Email or Password Incorrect"
 *       403:
 *         description: Cuenta de usuario inactiva
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
 *                   example: "User Account Inactive"
 */
router.post("/", (req, res) => {
    query(
        "SELECT * FROM user WHERE email = ?",
        [req.body.email],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Email o Password Incorrecto",
                    });
                } else {
                    if (result[0].permission != 0) {
                        if (result[0].password === req.body.password) {                            
                            // Create a JWT token
                            const token = jwt.sign({
                                user_id: result[0].id,
                                email: result[0].email,
                                permission: result[0].permission,
                                first_name: result[0].first_name,
                                last_name: result[0].last_name,
                            }, process.env.SECRETKEY, {expiresIn: "24h",});

                            return res.status(200).send({
                                success: true,
                                message: "Solicitud procesada exitosamente",
                                token
                            });
                        } else {
                            return res.status(400).send({
                                success: false,
                                message: "Email o Password Incorrecto",
                            });
                        }
                    } else {
                        return res.status(400).send({
                            success: false,
                            message: "Cuenta de usuario inactiva",
                        });
                    }
                }
            }
        }
    );
});

module.exports = router;
