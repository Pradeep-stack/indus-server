import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getPackagesByRegion,
} from "../controllers/packages.controller.js";

const router = express.Router();

router.post("/add", createPackage);
router.get("/get-all", getAllPackages);
router.get("/get-by-region/:region", getPackagesByRegion);
router.get("/gey-by-id/:id", getPackageById);
router.put("/update/:id", updatePackage);
router.delete("/delete/:id", deletePackage);

export default router;
