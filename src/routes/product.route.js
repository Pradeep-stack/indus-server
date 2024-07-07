import { Router } from "express";
import { addProduct, getProduct, deleteProduct } from "../controllers/product.controller";

const router = Router()

router.route("/add-product").post(addProduct)
router.route("/get-product").get(getProduct)
router.route("/delete-product/:id").delete(deleteProduct)

export default router;