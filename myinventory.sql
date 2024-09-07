

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Estructura de tabla para categoría
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Registros de categoría
-- ----------------------------
/*INSERT INTO `category` VALUES (1, 'Grocery');
INSERT INTO `category` VALUES (2, 'Clothes');
INSERT INTO `category` VALUES (3, 'VEHICULO');
INSERT INTO `category` VALUES (4, 'ELECTRO');*/

-- ----------------------------
-- Estructura de la tabla para pedidos.
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_date` datetime NOT NULL,
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Registros de pedidos
-- ----------------------------
/*INSERT INTO `orders` VALUES (6, 2, 9, 4, '2024-07-26 21:24:29');
INSERT INTO `orders` VALUES (7, 2, 9, 42, '2024-07-26 21:27:41');
INSERT INTO `orders` VALUES (10, 1, 13, 9, '2024-07-27 01:43:32');*/

-- ----------------------------
-- Estructura de la tabla para permiso.
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `permission_id` int NOT NULL,
  `permission_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`permission_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Registros de permiso
-- ----------------------------
INSERT INTO `permission` VALUES (1, 'user');
INSERT INTO `permission` VALUES (2, 'admin');

-- ----------------------------
-- Estructura de mesa para productos
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category` int NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NOT NULL,
  `stock` int NOT NULL,
  `supplier` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`product_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- registros de productos
-- ----------------------------
/*INSERT INTO `products` VALUES (2, 2, 'Test1', 'test', 34.67, 5, 1, 1);
INSERT INTO `products` VALUES (6, 2, 'Tomato', '1kg', 15.00, 25, 2, 2);
INSERT INTO `products` VALUES (8, 4, 'men shirts', 'white', 55.00, 3, 1, 2);
INSERT INTO `products` VALUES (9, 4, 'Jackets', 'black', 240.00, 1, 1, 2);
INSERT INTO `products` VALUES (10, 2, 'potato', 'good potato', 23.00, 7, 2, 2);
INSERT INTO `products` VALUES (12, 2, 'MOTO', 'USADA', 30.00, 5, 2, 2);
INSERT INTO `products` VALUES (13, 3, 'BUS', 'USADO', 30.00, 1, 2, 3);*/

-- ----------------------------
-- Estructura de tabla para proveedor
-- ----------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier`  (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `supplier_phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `supplier_email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`supplier_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Registros de proveedor
-- ----------------------------
INSERT INTO `supplier` VALUES (1, 'Store 1', '12312312', 'store1@gmail.com');
INSERT INTO `supplier` VALUES (2, 'Store 2', '234234234', 'store2@gmail.com');

-- ----------------------------
-- Estructura de tabla para el usuario
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `first_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `permission` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Registros de usuario
-- ----------------------------
INSERT INTO `user` VALUES (1, 'test@gmail.com', '123456789', 'Test', 'Test', 'aA12345678', 2);
INSERT INTO `user` VALUES (2, 'test2@gmail.com', '123456789', 'Test2', 'Test2', 'aA12345678', 2);
INSERT INTO `user` VALUES (3, 'testuser@gmail.com', '+100000000', 'asd', 'asd', 'aA12345678', 1);

SET FOREIGN_KEY_CHECKS = 1;
