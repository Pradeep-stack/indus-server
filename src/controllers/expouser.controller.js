import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ExpoUser } from "../models/user.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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


  const registerExpoUser = asyncHandler(async (req, res) => {
    const { name, email, phone, city } = req.body;
  
    if (!name || !email || !phone || !city) {
      return res
        .status(400)
        .json(new ApiError(400, "All fields (name, email, phone, city) are required"));
    }
  
    try {

     let id = await generateUniqueId();
      const existingUser = await ExpoUser.findOne({ email });
  
      if (existingUser) {
        return res
          .status(409)
          .json(new ApiError(409, "User with this email already exists"));
      }
  
      // Create a new user
      const newUser = new ExpoUser({
        id,
        name,
        email,
        phone,
        city,
      });
  
      // Save user to the database
      const createdUser = await newUser.save();
  
      // Return success response
      return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
    } catch (error) {
      // Handle unexpected errors
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error"));
    }
  });
  ;

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
  const userId = req.params.id;

  const user = await ExpoUser.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new ApiResponse(200, user, "User retrieved successfully"));
});
export { registerExpoUser, getAllUsers, getUserById };