import { Router } from "express";
import { createTestimonial ,deleteTestimonial,getAllTestimonials, getTestimonialById, updateTestimonial} from "../controllers/testimonial.controller.js";

const router = Router()

router.route("/create-testimonial").post(createTestimonial)
router.route("/getAll-testimonials").get(getAllTestimonials)
router.route("/upadate-testimonial/:id").patch(updateTestimonial)
router.route("/details-testimonial/:id").get(getTestimonialById)
router.route("/delete-testimonial/:id").delete(deleteTestimonial)
export default router