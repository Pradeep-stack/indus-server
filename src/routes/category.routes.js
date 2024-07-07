import { Router } from "express";
import { addCategory, getCategory, deleteCategory } from "../controllers/category.controller.js";

const router = Router()

router.route("/add-category").post(addCategory)
router.route("/get-category").get(getCategory)
router.route("/delete-category/:id").delete(deleteCategory)

export default router;