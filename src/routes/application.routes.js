import { Router } from "express";
import { subamitApplication ,getApplicationForAdmin, getApplicationForCenter, getApplicationForUser, updateApplication} from "../controllers/application.controller.js";

const router = Router()

router.route("/submit-application-1").post(subamitApplication)
router.route("/get-applications-admin-1").get(getApplicationForAdmin)
router.route("/get-applications-center-1/:id").get(getApplicationForCenter)
router.route("/get-application-user-1/:id").get(getApplicationForUser)
router.route("/application-update-1/:id").patch(updateApplication)


export default router;