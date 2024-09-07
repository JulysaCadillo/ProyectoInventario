const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");

/**
 * @openapi
 * tags:
 *   - name: Pedidos
 *     description: Operaciones relacionadas con los pedidos de usuarios
 */

/**
 * @openapi
 * /api/auth/orders:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener todos los pedidos
 *     description: Recupera todos los pedidos realizados por los usuarios, incluyendo detalles de productos y usuarios.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *     responses:
 *       200:
 *         description: Pedidos recuperados con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 101
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   product_name:
 *                     type: string
 *                     example: "Producto Ejemplo"
 *                   user_email:
 *                     type: string
 *                     example: "usuario@example.com"
 *                   order_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-03T12:00:00Z"
 *       400:
 *         description: No se encontraron pedidos
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
 *                   example: "No Orders found in your account"
 *       500:
 *         description: Error en la consulta de pedidos
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
            "SELECT * FROM orders as o LEFT JOIN products as p on p.product_id = o.product_id LEFT JOIN user as u on u.id = o.user_id",
            [],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "No se encontraron ordenes en su cuenta",
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
 * /api/auth/orders/{orderId}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener un pedido específico
 *     description: Recupera los detalles de un pedido específico utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: El ID del pedido que se desea recuperar.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Pedido recuperado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 101
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   product_name:
 *                     type: string
 *                     example: "Producto Ejemplo"
 *                   order_date:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-03T12:00:00Z"
 *       400:
 *         description: Pedido no encontrado
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
 *                   example: "order not found in your account"
 *       500:
 *         description: Datos insuficientes para procesar la solicitud
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
    .get("/:orderId", (req, res) => {
        if (req.params.orderId === "" || req.params.orderId === undefined) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "SELECT * FROM orders as o join products as p on p.product_id = o.product_id WHERE o.order_id = ?",
            [req.params.orderId],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "orden no encontrado en su cuenta",
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
 * /api/auth/orders:
 *   post:
 *     tags: [Pedidos]
 *     summary: Crear un nuevo pedido
 *     description: Permite a un usuario crear un nuevo pedido, actualizando el stock del producto correspondiente.
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
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               user_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Pedido creado con éxito
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
 *                   example: "order added successfully"
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
 *         description: Error al crear el pedido
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
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');


        if (
            req.body.product_id === "" ||
            req.body.quantity === "" ||
            req.body.user_id === "" ||
            req.body.product_id === undefined ||
            req.body.user_id === undefined ||
            req.body.quantity === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }
        query(
            "UPDATE products SET stock = stock - ? WHERE product_id = ?",
            [
                req.body.quantity,
                req.body.product_id,
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    
                        query(
                            "INSERT INTO orders (product_id, quantity, user_id, created_date) values (?, ?, ?, ?)",
                            [
                                req.body.product_id,
                                req.body.quantity,
                                req.body.user_id,
                                `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                            ],
                            (error, result) => {
                                if (error !== null) {
                                    return res.status(error.status).send(error.message);
                                } else {
                                    if (result.insertId && result.affectedRows > 0) {
                                        return res.status(200).send({
                                            success: true,
                                            message: "pedido agregado exitosamente",
                                            result,
                                        });
                                    }
                                }
                            }
                        );
                }
            }
        );
    })

    .patch("/", (req, res) => {})

    /**
 * @openapi
 * /api/auth/orders/{orderId}:
 *   delete:
 *     tags: [Pedidos]
 *     summary: Eliminar un pedido específico
 *     description: Permite a un usuario eliminar un pedido específico utilizando su ID y actualiza el inventario del producto correspondiente.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: El ID del pedido que se desea eliminar.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Pedido eliminado con éxito y el inventario actualizado
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
 *                   example: "Order removed successfully and inventory updated"
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
 *       404:
 *         description: Pedido no encontrado
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
 *                   example: "Order not found"
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
    .delete("/:orderId", (req, res) => {
        const orderId = req.params.orderId;
    
        // Check if orderId is a valid number
        if (!Number(orderId)) {
            return res.status(400).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }
    
        // Step 1: Fetch the order details
        query("SELECT product_id, quantity FROM orders WHERE order_id = ?", [orderId], (error, orderResult) => {
            if (error) {
                return res.status(500).send(error.message);
            }
    
            if (orderResult.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Orden no encontrada",
                });
            }
    
            const { product_id, quantity } = orderResult[0];
    
            // Step 2: Delete the order
            query("DELETE FROM orders WHERE order_id = ?", [orderId], (deleteError, deleteResult) => {
                if (deleteError) {
                    return res.status(500).send(deleteError.message);
                }
    
                // Step 3: Update the product inventory
                query("UPDATE products SET stock = stock + ? WHERE product_id = ?", [quantity, product_id], (updateError, updateResult) => {
                    if (updateError) {
                        return res.status(500).send(updateError.message);
                    }
    
                    // Check if the order was deleted successfully
                    if (deleteResult.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "La orden se eliminó correctamente y el inventario se actualizó",
                            result: updateResult,
                        });
                    } else {
                        return res.status(200).send({
                            success: false,
                            message: "La solicitud de este producto específico no se pudo procesar",
                        });
                    }
                });
            });
        });
    })

    /**
 * @openapi
 * /api/auth/orders/{orderId}:
 *   put:
 *     tags: [Pedidos]
 *     summary: Actualizar un pedido específico
 *     description: Permite a un usuario actualizar los detalles de un pedido específico utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: El ID del pedido que se desea actualizar.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               quantity_original:
 *                 type: integer
 *                 example: 2
 *               user_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Pedido actualizado con éxito
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
 *                   example: "order edited successfully"
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
 *       404:
 *         description: Pedido no encontrado
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
 *                   example: "Order not found"
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
    .put("/:orderId", (req, res) => {
        
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        if (
            req.body.product_id === "" ||
            req.body.quantity === "" ||
            req.body.quantity_original === "" ||
            req.body.user_id === "" ||
            req.body.product_id === undefined ||
            req.body.user_id === undefined ||
            req.body.quantity_original === undefined ||
            req.body.quantity === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }
        query(
            "UPDATE products SET stock = stock - ? WHERE product_id = ?",
            [
                req.body.quantity - req.body.quantity_original,
                req.body.product_id,
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {

                    query(
                        "UPDATE orders SET product_id = ?, quantity = ?, user_id = ?, created_date = ? WHERE order_id = ?",
                        [
                            req.body.product_id,
                            req.body.quantity,
                            req.body.user_id,
                            `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
                            req.params.orderId
                        ],
                        (error, result) => {
                            if (error !== null) {
                                return res.status(error.status).send(error.message);
                            } else {
                                if (result.affectedRows > 0) {
                                    return res.status(200).send({
                                        success: true,
                                        message: "orden editado exitosamente",
                                        result,
                                    });
                                }
                            }
                        }
                    );
                }
        })
    });

module.exports = router;
