import express from 'express';
import { protect } from "../middleware/jwt_middleware.js";
import { createTestimonial,getAllTestimonials,getTestimonialById,updateTestimonial,deleteTestimonial } from '../controllers/testimonial/testimonial_controller.js';

const testimonialRouter = express.Router();
testimonialRouter.use(protect)

testimonialRouter.post("/create",createTestimonial);
testimonialRouter.get("/all",getAllTestimonials);
testimonialRouter.get("/:id",getTestimonialById);
testimonialRouter.patch("/:id", updateTestimonial);
testimonialRouter.delete("/:id",deleteTestimonial);

export default testimonialRouter;