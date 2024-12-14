import { Router } from "express";
import { 
 registerExpoUser,
 getAllExpoUsers,
 getUserById
} from "../controllers/expouser.controller.js";


const router = Router()

router.route("/register").post(registerExpoUser )
router.route("/get-all-user").get(getAllExpoUsers)
router.route("/user-by-id/:id").get(getUserById)

export default router