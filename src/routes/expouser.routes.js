import { Router } from "express";
import { 
 registerExpoUser,
 getAllExpoUsers,
 getUserById,
 updateUserById, deleteUserById
} from "../controllers/expouser.controller.js";


const router = Router()

router.route("/register").post(registerExpoUser )
router.route("/allusers").get(getAllExpoUsers)
router.route("/get-user/:phone").get(getUserById)
router.route("/update-user/:phone").put(updateUserById)
router.route("/delete-user/:phone").delete(deleteUserById)

export default router