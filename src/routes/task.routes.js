import { Router } from "express";
import { addTask, getAllTask, updateTask, deleteTask,  } from "../controllers/task.controller.js";

const router = Router()

router.route("/add-task").post(addTask)
router.route("/get-task").get(getAllTask)
router.route("/update-task/:id").put(updateTask)
router.route("/delete-task/:id").delete(deleteTask)

export default router;