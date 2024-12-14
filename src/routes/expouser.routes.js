import { Router } from "express";
import { 
 registerExpoUser,
 getAllExpoUsers,
 getUserById
} from "../controllers/expouser.controller.js";


const router = Router()

router.route("/register").post(registerExpoUser )
router.route("/allusers").get(getAllExpoUsers)
router.route("/user/:id").get(getUserById)

export default router