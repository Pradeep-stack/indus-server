import { Router } from "express";
import { uploadSingle, uploadMultiple } from "../middlewares/multer.middleware.js"
import { submitApplication ,getApplicationForAdmin, getApplicationForCenter, getApplicationForUser, updateApplication,getApplicationById,singleImageUpload,multipleImageUpload,deleteApplication} from "../controllers/parentDeclaration.js";

const router = Router()

router.route("/submit-application").post(submitApplication)
router.route("/get-applications-admin").get(getApplicationForAdmin)
router.route("/get-applications-center/:id").get(getApplicationForCenter)
router.route("/get-application-user/:id").get(getApplicationForUser)
router.route("/application-update/:id").patch(updateApplication)
router.route("/get-application-id/:id").get(getApplicationById)
router.route("/signature").post(uploadSingle,singleImageUpload)
router.route("/signatures").post(uploadMultiple,multipleImageUpload)
router.route("/delete-application/:id").delete(deleteApplication)
export default router;