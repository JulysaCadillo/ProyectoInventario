
const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");

/**
 * @openapi
 * tags:
 *   - name: Productos
 *     description: Operaciones relacionadas con los productos
 */

/**
 * @openapi
 * /api/auth/inventory:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener todos los productos
 *     description: Recupera una lista de todos los productos junto con sus categorías, usuarios y proveedores asociados.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *     responses:
 *       200:
 *         description: Productos obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     example: "Producto Ejemplo"
 *                   category:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                         example: 10
 *                       category_name:
 *                         type: string
 *                         example: "Electrónica"
 *                   user:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 5
 *                       username:
 *                         type: string
 *                         example: "usuario123"
 *                   supplier:
 *                     type: object
 *                     properties:
 *                       supplier_id:
 *                         type: integer
 *                         example: 3
 *                       supplier_name:
 *                         type: string
 *                         example: "Proveedor ABC"
 *       400:
 *         description: No se encontraron productos
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
 *                   example: "No products found in your account"
 *       500:
 *         description: Error en la consulta
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
 *                   example: "Error message from the database"
 */
router
    .get("/", (req, res) => {
        query(
            "SELECT * FROM products as p LEFT JOIN category as c on c.category_id = p.category LEFT JOIN user as u on u.id = p.user_id LEFT JOIN supplier as s on s.supplier_id = p.supplier",
            [],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "No se encontraron productos en su cuenta",
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
 * /api/auth/inventory/{productId}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto específico
 *     description: Recupera la información de un producto específico utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: productId
 *         required: true
 *         description: El ID del producto que se desea obtener.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Producto obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     example: "Producto Ejemplo"
 *                   category:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                         example: 10
 *                       category_name:
 *                         type: string
 *                         example: "Electrónica"
 *       400:
 *         description: Producto no encontrado
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
 *                   example: "product not found in your account"
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
    .get("/:productId", (req, res) => {
        if (req.params.productId === "" || req.params.productId === undefined) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "SELECT * FROM products as p join category as c on c.category_id = p.category WHERE product_id = ?",
            [req.params.productId],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.length === 0) {
                        return res.status(400).send({
                            success: false,
                            message: "producto no encontrado en su cuenta",
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
 * /api/auth/inventory:
 *   post:
 *     tags: [Productos]
 *     summary: Agregar un nuevo producto
 *     description: Crea un nuevo producto en el sistema utilizando la información proporcionada.
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
 *               category:
 *                 type: integer
 *                 example: 10
 *               productName:
 *                 type: string
 *                 example: "Nuevo Producto"
 *               description:
 *                 type: string
 *                 example: "Descripción del nuevo producto."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 100
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               supplier:
 *                 type: string
 *                 example: "Proveedor XYZ"
 *     responses:
 *       200:
 *         description: Producto agregado con éxito
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
 *                   example: "product added successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     insertId:
 *                       type: integer
 *                       example: 1
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
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
    .post("/", (req, res) => {
        if (
            typeof req.body.category !== "number" ||
            req.body.productName === "" ||
            req.body.description === "" ||
            req.body.price === "" ||
            req.body.stock === "" ||
            req.body.user_id === "" ||
            req.body.supplier === "" ||
            req.body.category === undefined ||
            req.body.productName === undefined ||
            req.body.description === undefined ||
            req.body.price === undefined ||
            req.body.stock === undefined ||
            req.body.user_id === undefined ||
            req.body.supplier === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "INSERT INTO products (category, product_name, description, price, stock, supplier, user_id) values (?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.category,
                req.body.productName,
                req.body.description,
                req.body.price,
                req.body.stock,
                req.body.supplier,
                req.body.user_id,
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.insertId && result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "producto agregado exitosamente",
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
 * /api/auth/inventory/{productId}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar un producto específico
 *     description: Elimina un producto del sistema utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: productId
 *         required: true
 *         description: El ID del producto que se desea eliminar.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito o no se pudo procesar la solicitud
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
 *                   example: "product removed successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
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
    .delete("/:productId", (req, res) => {
        if (!Number(req.params.productId)) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "DELETE FROM products WHERE product_id = ?",
            [req.params.productId],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "producto eliminado exitosamente",
                            result,
                        });
                    } else {
                        return res.status(200).send({
                            success: false,
                            message:
                                "La solicitud de este producto específico no se pudo procesar.",
                            result,
                        });
                    }
                }
            }
        );
    })

    /**
 * @openapi
 * /api/auth/inventory/{productId}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar un producto específico
 *     description: Actualiza la información de un producto existente utilizando su ID.
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         required: true
 *         type: string
 *         description: A token header for your API request
 *       - in: path
 *         name: productId
 *         required: true
 *         description: El ID del producto que se desea actualizar.
 *         schema:
 *           type: string
 *           example: "123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: integer
 *                 example: 10
 *               productName:
 *                 type: string
 *                 example: "Producto Actualizado"
 *               description:
 *                 type: string
 *                 example: "Descripción actualizada del producto."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 29.99
 *               stock:
 *                 type: integer
 *                 example: 150
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               supplier:
 *                 type: string
 *                 example: "Proveedor XYZ"
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
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
 *                   example: "product edited successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
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
    .put("/:productId", (req, res) => {
        console.log(req.body)
        if (
            typeof req.body.category !== "number" ||
            req.body.productName === "" ||
            req.body.description === "" ||
            req.body.price === "" ||
            req.body.stock === "" ||
            req.body.user_id === "" ||
            req.body.supplier === "" ||
            req.body.category === undefined ||
            req.body.productName === undefined ||
            req.body.description === undefined ||
            req.body.price === undefined ||
            req.body.stock === undefined ||
            req.body.user_id === undefined ||
            req.body.supplier === undefined
        ) {
            return res.status(500).send({
                success: false,
                message: "No hay suficientes datos para procesar la solicitud",
            });
        }

        query(
            "UPDATE products SET category = ?, product_name = ?, description = ?, price = ?, stock = ?, supplier = ? WHERE user_id = ? AND product_id = ?",
            [
                req.body.category,
                req.body.productName,
                req.body.description,
                req.body.price,
                req.body.stock,
                req.body.supplier,
                req.body.user_id,
                req.params.productId,
            ],
            (error, result) => {
                if (error !== null) {
                    return res.status(error.status).send(error.message);
                } else {
                    if (result.affectedRows > 0) {
                        return res.status(200).send({
                            success: true,
                            message: "producto editado exitosamente",
                            result,
                        });
                    }
                }
            }
        );
    });

module.exports = router;
