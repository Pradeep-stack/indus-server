import { Router } from "express";
import {
  registerExpoUser,
  getAllExpoUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  importExpoUsers,
  addWebsite,
  getWebsite,
  updateWebsite,
} from "../controllers/expouser.controller.js";
import { upload } from "../utils/multerUpload.js";

const router = Router();

router.route("/register").post(registerExpoUser);
router.route("/allusers").get(getAllExpoUsers);
router.route("/get-user/:phone").get(getUserById);
router.route("/update-user/:phone").patch(updateUserById);
router.route("/delete-user/:phone").delete(deleteUserById);
router.post("/import", upload.single("file"), importExpoUsers);
router.post("/add-website", addWebsite);
router.get("/get-website", getWebsite);
router.patch("/update-website-link", updateWebsite);

export default router;
