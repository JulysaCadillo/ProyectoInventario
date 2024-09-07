const express = require("express");
const router = express.Router();
const query = require("../modules/sqlQuery");
/**
 * @openapi
 * tags:
 *   - name: Categorías
 *     description: Operaciones relacionadas con las categorías
 */

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener todas las categorías
 *     description: Recupera una lista de todas las categorías disponibles en el sistema.
 *     responses:
 *       200:
 *         description: Categorías obtenidas con éxito
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
 *                   example: "Categories fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Electrónica"
 *       400:
 *         description: Categorías no disponibles
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
 *                   example: "Categories unavailable."
 */
router
    .get("/", (req, res) => {
    query(
        "SELECT * FROM category",
        [],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Categorías no disponibles.",
                    });
                } else {
                    return res.status(200).send({
                        success: true,
                        message: "Categorías obtenidas correctamente",
                        data: result,
                    });
                }
            }
        }
    );
})

/**
 * @openapi
 * /api/categories/{categoryId}:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener una categoría específica
 *     description: Recupera la información de una categoría específica utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: El ID de la categoría que se desea obtener.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Categoría obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                       example: 123
 *                     name:
 *                       type: string
 *                       example: "Electrónica"
 *                     description:
 *                       type: string
 *                       example: "Categoría de productos electrónicos"
 *       400:
 *         description: Categoría no encontrada
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
 *                   example: "Category not found in your account"
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

.get("/:categoryId", (req, res) => {
    if (req.params.categoryId === "" || req.params.categoryId === undefined) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "SELECT * FROM category WHERE category_id = ?",
        [req.params.categoryId],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.length === 0) {
                    return res.status(400).send({
                        success: false,
                        message: "Categoría no encontrada en su cuenta",
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
 * /api/categories:
 *   post:
 *     tags: [Categorías]
 *     summary: Agregar una nueva categoría
 *     description: Crea una nueva categoría en el sistema utilizando el nombre de la categoría proporcionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: "Electrónica"
 *     responses:
 *       200:
 *         description: Categoría agregada con éxito
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
 *                   example: "Category added successfully"
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
        req.body.category_name === "" ||
        req.body.category_name === undefined
    ) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "INSERT INTO category (category_name) values (?)",
        [
            req.body.category_name,
        ],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.insertId && result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Categoría agregada exitosamente",
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
 * /api/categories/{categoryId}:
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar una categoría específica
 *     description: Elimina una categoría del sistema utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: El ID de la categoría que se desea eliminar.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito o no se pudo procesar la solicitud
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
 *                   example: "Category removed successfully"
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
.delete("/:categoryId", (req, res) => {
    if (!Number(req.params.categoryId)) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar las solicitudes.",
        });
    }

    query(
        "DELETE FROM category WHERE category_id = ?",
        [req.params.categoryId],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Categoría eliminada correctamente",
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
 * /api/categories/{categoryId}:
 *   put:
 *     tags: [Categorías]
 *     summary: Actualizar una categoría específica
 *     description: Actualiza el nombre de una categoría existente utilizando su ID.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: El ID de la categoría que se desea actualizar.
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
 *               category_name:
 *                 type: string
 *                 example: "Electrónica Actualizada"
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito
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
 *                   example: "Category edited successfully"
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
.put("/:categoryId", (req, res) => {
    if (
        req.body.category_name === "" ||
        req.body.category_name === undefined
    ) {
        return res.status(500).send({
            success: false,
            message: "No hay suficientes datos para procesar la solicitud",
        });
    }

    query(
        "UPDATE category SET category_name = ? WHERE category_id = ?",
        [
            req.body.category_name,
            req.params.categoryId,
        ],
        (error, result) => {
            if (error !== null) {
                return res.status(error.status).send(error.message);
            } else {
                if (result.affectedRows > 0) {
                    return res.status(200).send({
                        success: true,
                        message: "Categoría editada exitosamente",
                        result,
                    });
                }
            }
        }
    );
});

module.exports = router;
