const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");

/**
 * @openapi
 * tags:
 *   - name: Usuarios
 *     description: Operaciones relacionadas con la gestión de usuarios
 */

/**
 * @openapi
 * /api/auth/user:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener la lista de usuarios
 *     description: Recupera todos los usuarios disponibles en la base de datos junto con sus permisos.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *     responses:
 *       200:
 *         description: Usuarios recuperados con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "usuarioEjemplo"
 *                   permission:
 *                     type: string
 *                     example: "admin"
 *                   permission_id:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: No se encontraron usuarios
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
 *                   example: "No Users found in your account"
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
router
    .get("/", (req, res) => {

        query(
            "SELECT * FROM user as u LEFT JOIN permission as p on p.permission_id = u.permission",
            [],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "No se encontraron usuarios en su cuenta",
                        });
                    } else {
                        return res.status(200).send(result);
                    }
                }
            }
        );
    })

    /**
 * @openapi
 * /api/auth/user/{userId}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener un usuario específico
 *     description: Recupera los detalles de un usuario específico utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: userId
 *         required: true
 *         description: El ID del usuario que se desea recuperar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario recuperado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "usuarioEjemplo"
 *                 permission:
 *                   type: string
 *                   example: "admin"
 *                 permission_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Usuario no encontrado
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
 *                   example: "user not found in your account"
 *       500:
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
 *                   example: "Not enough data to process the request"
 */
    .get("/:userId", (req, res) => {
        if (req.params.userId === "" || req.params.userId === undefined) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "SELECT * FROM user as u join permission as p on p.permission_id = u.permission WHERE u.id = ?",
            [req.params.userId],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "usuario no encontrado en su cuenta",
                        });
                    } else {
                        return res.status(200).send(result);
                    }
                }
            }
        );
    })

    /**
 * @openapi
 * /api/auth/user:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     description: Permite agregar un nuevo usuario a la base de datos.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
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
 *                 example: "usuario@ejemplo.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               first_name:
 *                 type: string
 *                 example: "Juan"
 *               last_name:
 *                 type: string
 *                 example: "Pérez"
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *               permission:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Usuario creado con éxito
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
 *                   example: "user added successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     insertId:
 *                       type: integer
 *                       example: 1
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
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
 *                   example: "Not enough data to process the request"
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
    .post("/", (req, res) => {
        if (
            req.body.email === "" ||
            req.body.phone === "" ||
            req.body.first_name === "" ||
            req.body.last_name === "" ||
            req.body.password === "" ||
            req.body.permission === "" ||
            req.body.email === undefined ||
            req.body.phone === undefined ||
            req.body.first_name === undefined ||
            req.body.last_name === undefined ||
            req.body.password === undefined ||
            req.body.permission === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "INSERT INTO user (email, phone, first_name, last_name, password, permission) values (?, ?, ?, ?, ?, ?)",
            [
                req.body.email,
                req.body.phone,
                req.body.first_name,
                req.body.last_name,
                req.body.password,
                req.body.permission
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.insertId && result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "usuario agregado exitosamente",
                            result,
                        });
                    }
                }
            }
        );
    })

    .patch("/", (req, res) => {})

    /**
 * @openapi
 * /api/auth/user/{userId}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario específico
 *     description: Permite eliminar un usuario de la base de datos utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: userId
 *         required: true
 *         description: El ID del usuario que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
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
 *                   example: "user removed successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Usuario no encontrado o no se pudo procesar la solicitud
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
 *                   example: "Request for this specific product couldn't be processed"
 *       500:
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
 *                   example: "Not enough data to process the request"
 */
    .delete("/:userId", (req, res) => {
        if (!Number(req.params.userId)) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "DELETE FROM user WHERE id = ?",
            [req.params.userId],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "Usuario eliminada con éxito",
                            result,
                        });
                    } else {
                        return res.status(200).send({
                            success: false,
                            message:
                                "La solicitud de este producto específico no se pudo procesar",
                            result,
                        });
                    }
                }
            }
        );
    })

    /**
 * @openapi
 * /api/auth/user/{userId}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario específico
 *     description: Permite actualizar los detalles de un usuario utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: userId
 *         required: true
 *         description: El ID del usuario que se desea actualizar.
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 example: "usuario@ejemplo.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               first_name:
 *                 type: string
 *                 example: "Juan"
 *               last_name:
 *                 type: string
 *                 example: "Pérez"
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura123"
 *               permission:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
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
 *                   example: "user edited successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
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
 *                   example: "Not enough data to process the request"
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
    .put("/:userId", (req, res) => {
        if (
            req.body.email === "" ||
            req.body.phone === "" ||
            req.body.first_name === "" ||
            req.body.last_name === "" ||
            req.body.password === "" ||
            req.body.permission === "" ||
            req.body.email === undefined ||
            req.body.phone === undefined ||
            req.body.first_name === undefined ||
            req.body.last_name === undefined ||
            req.body.password === undefined ||
            req.body.permission === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "UPDATE user SET email = ?, phone = ?, first_name = ?, last_name = ?, password = ?, permission = ? WHERE id = ?",
            [
                req.body.email,
                req.body.phone,
                req.body.first_name,
                req.body.last_name,
                req.body.password,
                req.body.permission,
                req.params.userId,
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "Usuario editada con éxito",
                            result,
                        });
                    }
                }
            }
        );
    });

module.exports = router;
