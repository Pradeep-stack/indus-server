import { Router } from "express";
import { addForm ,getFormForAdmin, getFormForCenter, getFormForUser, updateForm} from "../controllers/form.controller.js";

const router = Router()

router.route("/add-form").post(addForm)
router.route("/get-forms-admin").get(getFormForAdmin)
router.route("/get-forms-center/:id").get(getFormForCenter)
router.route("/get-forms-user/:id").get(getFormForUser)
router.route("/form-update/:id").patch(updateForm)


export default router;