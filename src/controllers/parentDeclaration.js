import {ParentDeclaration} from "../models/parentDeclaration.modal.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitApplication = asyncHandler(async (req, res) => {
    const data = req.body.parentDeclarationInfo;
    try {
      const applicationForm = await ParentDeclaration.create(data);
      return res
        .status(201)
        .json(new ApiResponse(200, applicationForm, 'Application Submitted Successfully..!'));
    } catch (error) {
      return res.status(500).json(new ApiError(400, null, error.message));
    }
  });

export const getApplicationById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const applicationForm = await ParentDeclaration.findById(id);
  
      if (!applicationForm) {
        return res
          .status(404)
          .json(new ApiError(404, null, 'Application not found'));
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, applicationForm, 'Get Application Successfully..!'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, null, error.message));
    }
  });

export const getApplicationForAdmin = asyncHandler(async (req, res) => {
    try {
      const applicationForm = await ParentDeclaration.find();
      return res
        .status(201)
        .json(new ApiResponse(200, applicationForm, "Get Applications Successfully..!"));
    } catch (error) {
      return res.status(500).json(new ApiError(400, null, error.message));
    }
  });

  export const getApplicationForCenter = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        const applicationForm = await ParentDeclaration.find({ centerId: { $in: [id] } });
        return res.status(200).json(new ApiResponse(200, applicationForm, "Get Apllications Successfully..!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});

export const getApplicationForUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        const applicationForm = await ParentDeclaration.find({ userId: id });
        return res.status(200).json(new ApiResponse(200, applicationForm, "Get Application Successfully..!"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});
// this is use for the update data using id 
export const updateApplication = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body; 
        const applicationForm = await ParentDeclaration.findByIdAndUpdate(id, updates, { new: true });
        if (!applicationForm) {
            return res.status(404).json(new ApiError(404, null, "Application not found"));
        }
        return res.status(200).json(new ApiResponse(200, applicationForm, "Application updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
    }
});

export const singleImageUpload = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json(new ApiError(400, null, 'No file uploaded'));
        }
    
        const filePath = `/uploads/images/${req.file.filename}`;
        return res.status(201).json(new ApiResponse(201, { filePath }, 'Single image uploaded successfully'));
      } catch (error) {
        return res.status(500).json(new ApiError(500, null, error.message));
      }
});
export const multipleImageUpload = asyncHandler(async (req, res) => {
    try {
              if (!req.files || req.files.length === 0) {
                return res.status(400).json(new ApiError(400, null, 'No files uploaded'));
              }
          
              const filePaths = req.files.map(file => `/uploads/images/${file.filename}`);
              return res.status(201).json(new ApiResponse(201, { filePaths }, 'Multiple images uploaded successfully'));
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

export  const deleteApplication = asyncHandler(async (req, res) => {
  const id = req.params.id; // Assuming you pass the user id in the request parameters

  const deletedUser = await ParentDeclaration.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(400).json(new ApiError(400, null, 'No Application Form Found'));
  }

  return res.json(new ApiResponse(200, null, "Application deleted successfully"));
});
