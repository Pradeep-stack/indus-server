import { Form } from "../models/form.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addForm = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const form = await Form.create(data);
    return res
      .status(201)
      .json(new ApiResponse(200, form, "Form Addedd Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiError(400, null, error.message));
  }
});

export const getFormForAdmin = asyncHandler(async (req, res) => {
    try {
      const form = await Form.find();
      return res
        .status(201)
        .json(new ApiResponse(200, form, "Get Forms Successfully..!"));
    } catch (error) {
      return res.status(500).json(new ApiError(400, null, error.message));
    }
  });

  export const getFormForCenter = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        console.log("centerId",req.params)
        const forms = await Form.find({ centerId: { $in: [id] } });
        return res.status(200).json(new ApiResponse(200, forms, "Get Forms Successfully..!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});

export const getFormForUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        const forms = await Form.find({ userId: id });
        return res.status(200).json(new ApiResponse(200, forms, "Get Form Successfully..!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});
// and this is use for the update data unsing any particur key 
// export const updateForm = asyncHandler(async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const updates = req.body; 
//         const form = await Form.findOneAndUpdate({ userId: userId }, updates, { new: true });
//         if (!form) {
//             return res.status(404).json(new ApiResponse(404, null, "Form not found"));
//         }
//         return res.status(200).json(new ApiResponse(200, form, "Form updated successfully"));
//     } catch (error) {
//         return res.status(500).json(new ApiResponse(500, null, error.message));
//     }
// });
// this is use for the update data using id 
export const updateForm = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body; 
        const form = await Form.findByIdAndUpdate(id, updates, { new: true });
        if (!form) {
            return res.status(404).json(new ApiError(404, null, "Form not found"));
        }
        return res.status(200).json(new ApiResponse(200, form, "Form updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});

