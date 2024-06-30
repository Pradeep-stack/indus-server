import { Router } from "express";
import { addColumn, getAllColumn, updateColumn, deleteColumn,  } from "../controllers/column.controller.js";

const router = Router()

router.route("/add-column").post(addColumn)
router.route("/get-column").get(getAllColumn)
router.route("/update-column/:id").put(updateColumn)
router.route("/delete-column/:id").delete(deleteColumn)

export default router;