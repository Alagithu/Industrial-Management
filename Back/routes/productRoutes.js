const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
router.route("/all").get(productController.getAllProducts);
router.route("/addProduct").post(productController.addProduct);
router.route("/deleteProduct/:id").delete(productController.deleteProduct);
router.route("/updateProduct/:id").put(productController.updateProduct);
router.route("/:category").get(productController.filtrerByCategory);
router.route("/filter").get(productController.filtreProduct);
router.route("/paginate").get(productController.paginateProducts);
module.exports = router;