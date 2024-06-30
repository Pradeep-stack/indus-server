import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Testimonial } from "../models/testimonial.modal.js";

export const createTestimonial = asyncHandler(async (req, res) => {
    const { postTitle, description, contant, cover,tag,metaTag,metaDescription,metaKeyword,enableComments,publis } = req.body;

    try {
        const testimonial = await Testimonial.create({
            postTitle, description, contant, cover,tag,metaTag,metaDescription,metaKeyword,enableComments,publis
        });
    
        return res.status(201).json(
            new ApiResponse(200, testimonial, "Testimonial Created successfully..!")
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, null, `Failed to create testimonial: ${error.message}`)
        ); 
    }
   
});

export const getAllTestimonials = asyncHandler(async (req, res)=>{
        try {
          const testimonials = await Testimonial.find();
          res.status(200).json( new ApiResponse(200, testimonials, "Testimonial Created successfully..!"));
        } catch (error) {
            return res.status(500).json(
                new ApiResponse(500, null, error.message)
            );
        }
      });
      
      export const updateTestimonial = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updates = req.body; // Contains fields to update
    
        try {
            const testimonial = await Testimonial.findById(id);
    
            if (!testimonial) {
                return res.status(404).json(
                    new ApiResponse(404, null, "Testimonial not found")
                );
            }
    
            // Apply updates to the testimonial object
            Object.keys(updates).forEach((key) => {
                testimonial[key] = updates[key];
            });
    
            const updatedTestimonial = await testimonial.save();
    
            return res.status(200).json(
                new ApiResponse(200, updatedTestimonial, "Testimonial updated successfully")
            );
        } catch (error) {
            return res.status(500).json(
                new ApiResponse(500, null, error.message)
            );
        }
    });

    export const getTestimonialById = asyncHandler(async (req, res) => {
        const { id } = req.params;
    
        try {
            const testimonial = await Testimonial.findById(id);
    
            if (!testimonial) {
                return res.status(404).json(
                    new ApiResponse(404, null, "Testimonial not found")
                );
            }
    
            return res.status(200).json(
                new ApiResponse(200, testimonial, "Testimonial retrieved successfully")
            );
        } catch (error) {
            return res.status(500).json(
                new ApiResponse(500, null, error.message)
            );
        }
    });

    export const deleteTestimonial = asyncHandler(async (req, res) => {
        const { id } = req.params;
    
        try {
            const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    
            if (!deletedTestimonial) {
                return res.status(404).json(
                    new ApiResponse(404, null, "Testimonial not found")
                );
            }
    
            return res.status(200).json(
                new ApiResponse(200, {}, "Testimonial deleted successfully")
            );
        } catch (error) {
            return res.status(500).json(
                new ApiResponse(500, null, error.message)
            );
        }
    });
    