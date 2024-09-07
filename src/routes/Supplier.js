const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");

/**
 * @openapi
 * tags:
 *   - name: Proveedores
 *     description: Operaciones relacionadas con la gestión de proveedores
 */

/**
 * @openapi
 * /api/supplier:
 *   get:
 *     tags: [Proveedores]
 *     summary: Obtener la lista de proveedores
 *     description: Recupera todos los proveedores disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Proveedores recuperados con éxito
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
 *                   example: "Supplier fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       supplier_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Proveedor Ejemplo"
 *                       contact_info:
 *                         type: string
 *                         example: "contacto@ejemplo.com"
 *       400:
 *         description: No hay proveedores disponibles
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
 *                   example: "Supplier unavailable."
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
router.get("/", (req, res) => {
    query(
        "SELECT * FROM supplier",
        [],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Proveedor no disponible.",
                    });
                } else {
                    return res.status(200).send({
                        success: true,
                        message: "Proveedor recuperado exitosamente",
                        data: result,
                    });
                }
            }
        }
    );
})


/**
 * @openapi
 * /api/suppliers/{supplierId}:
 *   get:
 *     tags: [Proveedores]
 *     summary: Obtener un proveedor específico
 *     description: Recupera los detalles de un proveedor específico utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         description: El ID del proveedor que se desea recuperar.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Proveedor recuperado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supplier_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Proveedor Ejemplo"
 *                 contact_info:
 *                   type: string
 *                   example: "contacto@ejemplo.com"
 *       400:
 *         description: Proveedor no encontrado
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
 *                   example: "Supplier not found in your account"
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
.get("/:supplierId", (req, res) => {
    if (req.params.supplierId === "" || req.params.supplierId === undefined) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "SELECT * FROM supplier WHERE supplier_id = ?",
        [req.params.supplierId],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Proveedor no encontrado en su cuenta",
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
 * /api/suppliers:
 *   post:
 *     tags: [Proveedores]
 *     summary: Agregar un nuevo proveedor
 *     description: Permite agregar un nuevo proveedor a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_name:
 *                 type: string
 *                 example: "Proveedor Ejemplo"
 *               supplier_email:
 *                 type: string
 *                 format: email
 *                 example: "proveedor@ejemplo.com"
 *               supplier_phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Proveedor agregado con éxito
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
 *                   example: "Supplier added successfully"
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
        req.body.supplier_name === "" ||
        req.body.supplier_email === "" ||
        req.body.supplier_phone === "" ||
        req.body.supplier_name === undefined ||
        req.body.supplier_email === undefined ||
        req.body.supplier_phone === undefined
    ) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "INSERT INTO supplier (supplier_name, supplier_email, supplier_phone) values (?, ?, ?)",
        [
            req.body.supplier_name,
            req.body.supplier_email,
            req.body.supplier_phone,
        ],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.insertId && result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Proveedor agregado exitosamente",
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
 * /api/suppliers/{supplierId}:
 *   delete:
 *     tags: [Proveedores]
 *     summary: Eliminar un proveedor específico
 *     description: Permite eliminar un proveedor de la base de datos utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         description: El ID del proveedor que se desea eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Proveedor eliminado con éxito
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
 *                   example: "Supplier removed successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Proveedor no encontrado o no se pudo procesar la solicitud
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
.delete("/:supplierId", (req, res) => {
    if (!Number(req.params.supplierId)) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "DELETE FROM supplier WHERE supplier_id = ?",
        [req.params.supplierId],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Proveedor eliminado exitosamente",
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
 * /api/suppliers/{supplierId}:
 *   put:
 *     tags: [Proveedores]
 *     summary: Actualizar un proveedor específico
 *     description: Permite actualizar los detalles de un proveedor utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         description: El ID del proveedor que se desea actualizar.
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
 *               supplier_name:
 *                 type: string
 *                 example: "Proveedor Actualizado"
 *               supplier_email:
 *                 type: string
 *                 format: email
 *                 example: "proveedor_actualizado@ejemplo.com"
 *               supplier_phone:
 *                 type: string
 *                 example: "+0987654321"
 *     responses:
 *       200:
 *         description: Proveedor actualizado con éxito
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
 *                   example: "Supplier edited successfully"
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
.put("/:supplierId", (req, res) => {
    if (
        req.body.supplier_name === "" ||
        req.body.supplier_email === "" ||
        req.body.supplier_phone === "" ||
        req.body.supplier_name === undefined ||
        req.body.supplier_email === undefined ||
        req.body.supplier_phone === undefined
    ) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "UPDATE supplier SET supplier_name = ?, supplier_email = ?, supplier_phone = ? WHERE supplier_id = ?",
        [
            req.body.supplier_name,
            req.body.supplier_email,
            req.body.supplier_phone,
            req.params.supplierId,
        ],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Proveedor editado exitosamente"
                    });
                }
            }
        }
    );
});

module.exports = router;
