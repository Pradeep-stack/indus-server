import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ExpoUser } from "../models/expouser.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import csv from 'csv-parser';
import { Readable } from 'stream';

const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;
  
    while (!isUnique) {
      uniqueId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
      const existingUser = await ExpoUser.findOne({ id: uniqueId });
      if (!existingUser) {
        isUnique = true; 
      }
    }
    return uniqueId;
  };

// controllers/expouser.controller.ts (continue in same file)

const importExpoUsers = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiError(400, "CSV file is required"));
  }

  let users= [];

  const stream = Readable.from(req.file.buffer);


  stream.pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      const report = [];

      for (const user of users) {
        try {
          const { name, company, phone, city, profile_pic, userType, email, password, state, stall_number } = user;

          if (!name || !phone || !city || !state || !userType) {
            throw new Error("Required fields missing (name, phone, city, userType)");
          }

          const existingUser = await ExpoUser.findOne({ phone });
          if (existingUser) {
            throw new Error("Phone number already exists");
          }

          const id = await generateUniqueId();

          const newUser = new ExpoUser({
            id,
            name,
            company,
            phone,
            city,
            state,
            profile_pic,
            userType,
            email,
            password,
            stall_number  // (ideally hash it if needed)
          });

          await newUser.save();

          report.push({ phone, status: "success" });

        } catch (error) {
          report.push({ phone: user.phone, status: "failed", reason: error.message });
        }
      }

      const summary = {
        total: report.length,
        success: report.filter(r => r.status === "success").length,
        failed: report.filter(r => r.status === "failed").length,
      };

      return res.status(200).json({ summary, report });
    });
});

  // const registerExpoUser = asyncHandler(async (req, res) => {
  //   const { name, company, phone, city, profile_pic } = req.body;
  
  //   if (!name || !company || !phone || !city ||!profile_pic) {
  //     return res
  //       .status(400)
  //       .json(new ApiError(400, "All fields (name, company, phone, city) are required"));
  //   }
  
  //   try {
  //     const id = await generateUniqueId();

  //     const existingUser = await ExpoUser.findOne({ phone });
  
  //     if (existingUser) {
  //       return res
  //         .status(400)
  //         .json({ status: 400, message: "Phone number already exists" });
  //     }
  
  //     const newUser = new ExpoUser({
  //       id,
  //       name,
  //       company,
  //       phone,
  //       city,
  //       profile_pic,
  //     });
  
  //     // Save the user to the database
  //     const createdUser = await newUser.save();
  
  //     // Return success response
  //     return res
  //       .status(201)
  //       .json(new ApiResponse(201, createdUser, "User registered successfully"));
  //   } catch (error) {
  //     // Log the error for debugging
  //     console.error("Error registering user:", error);
  
  //     // Return a generic error response
  //     return res
  //       .status(500)
  //       .json(new ApiError(500, "Internal server error"));
  //   }
  // });
  
 const registerExpoUser = asyncHandler(async (req, res) => {
    const { name, company, phone, city, profile_pic, userType, email, password, state } = req.body;
  
    // Validate required fields
    if (!name || !phone || !city || !state ||  !userType) {
      return res
        .status(400)
        .json(new ApiError(400, "Fields (name, phone, city, userType) are required"));
    }
  
    try {
      // Generate a unique ID
      const id = await generateUniqueId();
  
      // Check if the phone number already exists
      const existingUser = await ExpoUser.findOne({ phone });
  
      if (existingUser) {
        return res
          .status(400)
          .json(new ApiError(400, "Phone number already exists"));
      }
  
      // Create a new user instance
      const newUser = new ExpoUser({
        id,
        name,
        company, // Optional as per your schema
        phone,
        city,
        state,
        profile_pic, // Optional as per your schema
        userType,
        email, // Optional
        password, // Optional, should be hashed in real applications
      });
  
      // Save the user to the database
      const createdUser = await newUser.save();
  
      // Return success response
      return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
    } catch (error) {
      // Log the error for debugging
      console.error("Error registering user:", error);
  
      // Return a generic error response
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error"));
    }
  });

const getAllExpoUsers = asyncHandler(async (req, res) => {
  const users = await ExpoUser.find();
  if (!users || users.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No users found"));
  }
  // Return the list of users
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});


const getUserById = asyncHandler(async (req, res) => {
  const phone = req.params.phone;

  const user = await ExpoUser.findOne({phone});

  if (!user) {
    return res
        .status(400)
        .json(new ApiError(400, "User not found"));
  }

  return res.json(new ApiResponse(200, user, "User retrieved successfully"));
});

// Update User by Phone
const updateUserById = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  const updates = req.body;

  const user = await ExpoUser.findOneAndUpdate({ phone }, updates, {
    new: true, // Return the updated document
    runValidators: true, // Enforce schema validation on update
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  return res.json(new ApiResponse(200, user, "User updated successfully"));
});

// Delete User by Phone
const deleteUserById = asyncHandler(async (req, res) => {
  const phone = req.params.phone;

  const user = await ExpoUser.findOneAndDelete({ phone });

  if (!user) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  return res.json(new ApiResponse(200, null, "User deleted successfully"));
});

export { registerExpoUser, getAllExpoUsers, getUserById , updateUserById, deleteUserById, importExpoUsers };
