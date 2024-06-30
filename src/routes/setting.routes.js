import { Router } from "express";
import { getObject, updateObject } from "../controllers/setting.controller.js";


const router = Router()

router.route("/object").get(getObject)
router.route("/object").put(updateObject)


export default router;