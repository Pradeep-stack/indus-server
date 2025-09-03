import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { OTP } from "../models/otp.modal.js";
import crypto from "crypto";
import sendOtpEmail from "../utils/sendMail.js";

// Generate random 6-digit OTP
const generateOTP = () => crypto.randomInt(1000, 9999).toString();

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Phone number is required");
  }
  // Delete existing OTPs
  await OTP.deleteMany({ email });

  const otp = generateOTP();
  await OTP.create({ email, otp });

  // Send OTP via SMS or email
  const result = await sendOtpEmail(email, otp);
  if (result.success) {
    res
      .status(200)
      .json({ message: "OTP email sent successfully", data: result.data });
  } else {
    res
      .status(500)
      .json({ message: "Failed to send OTP email", error: result.error });
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found. Please register first" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully via OTP",
      data: {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    });
});

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    username,
    referredBy,
    age,
    sex,
    image,
    education,
    city,
    state,
    country,
    region,
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with email already exists"));
  }
  const innp = region === "india" ? "IN" : "NP";

  const newReferralCode = innp + nanoid(10);

  const user_type = "User";

  const user = new User({
    username,
    fullName,
    email,
    phone,
    password,
    user_type,
    referral_code: newReferralCode,
    referredBy: referredBy,
    age,
    sex,
    image,
    education,
    city,
    state,
    country,
    region,
  });

  if (referredBy) {
    const referringUser = await User.findOne({ referral_code: referredBy });
    if (referringUser) {
      // referringUser.points += 250;
      await referringUser.save();
    }
  }

  await user.save();

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// upgrade user with package 
// Helper function to find the deepest available parent in a branch
async function findDeepestAvailable(userId, branch) {
  let current = await User.findById(userId);
  while (current) {
    if (branch === "left") {
      if (!current.leftChild) return current;
      current = await User.findById(current.leftChild);
    } else {
      if (!current.rightChild) return current;
      current = await User.findById(current.rightChild);
    }
  }
  return null;
}

const upgradeUser = asyncHandler(async (req, res) => {
  try {
    const { userId, packagePlan, sponserBy, underChild, position } = req.body;

    if (!sponserBy || !position) {
      return res.status(409).json({ message: "Sponsor Code and Position are required" });
    }

    const existingUser = await User.findById(userId);
 
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }



    // ✅ Assign user_type & Sponsor Code
    let user_type, sponsorCode = null;
    if (packagePlan === "package-1") {
      user_type = "Admin"; // No sponsor code
    } else if (packagePlan === "package-2") {
      user_type = "Professional";
      sponsorCode =
        (existingUser.region === "india" ? "IND" : "NP") +
        Math.floor(100000 + Math.random() * 900000);
    } else if (packagePlan === "package-3") {
      user_type = "Corporate";
      sponsorCode =
        (existingUser.region === "india" ? "IND" : "NP") +
        Math.floor(1000000 + Math.random() * 9000000);
    } else {
      return res.status(400).json({ message: "Invalid package plan" });
    }

 
    existingUser.user_type = user_type;
    if (sponsorCode) existingUser.sponsor_code = sponsorCode;

    // ✅ Find Sponsor
    const sponsor = await User.findOne({ sponsor_code: sponserBy });
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    // ✅ Assign referral/upline if not already set
    if (!existingUser.referredBy) {
      // console.log("Upgrading user:", sponsor);
      existingUser.referredBy = sponsor.referral_code;
    }

    // console.log("Upgrading user:", existingUser);
    // return;
    existingUser.sponsorBy = sponsor.sponsor_code;

    // ✅ Tree placement (only Corporate & Professional)
    if (["Professional", "Corporate"].includes(user_type)) {
      let parent = underChild
        ? await User.findOne({ sponsor_code: underChild })
        : sponsor;

      if (!parent) {
        return res.status(404).json({ message: "Parent user not found" });
      }

      // --- Placement Logic ---
      if (parent) {
        if (position === "left" && !parent.leftChild) {
          parent.leftChild = existingUser._id;
          existingUser.position = "left";

        } else if (position === "right" && !parent.rightChild) {
          parent.rightChild = existingUser._id;
          existingUser.position = "right";

        } else if (position === "right" && parent.rightChild) {
          let childParent = await User.findById(parent.rightChild);
          while (childParent && childParent.rightChild) {
            childParent = await User.findById(childParent.rightChild);
          }
          if (childParent) {
            childParent.rightChild = existingUser._id;
            existingUser.position = "right";
            await childParent.save();
          }

        } else if (position === "left" && parent.leftChild) {
          let childParent = await User.findById(parent.leftChild);
          while (childParent && childParent.leftChild) {
            childParent = await User.findById(childParent.leftChild);
          }
          if (childParent) {
            childParent.leftChild = existingUser._id;
            existingUser.position = "left";
            await childParent.save();
          }
        }
      }

      await parent.save();
    }


    await existingUser.save();

    // ✅ Add direct referral
    await User.findByIdAndUpdate(
      sponsor._id,
      { $addToSet: { directReferrals: existingUser._id } },
      { new: true }
    );

    res.status(201).json({
      user: existingUser,
      message: "User upgraded successfully",
    });
  } catch (error) {
    console.error("Error upgrading user:", error);
    res.status(500).json({ message: "Something went wrong while upgrading the user" });
  }
});


// GET Tree API (multi-level)
const getUserTree = async (req, res) => {
  try {
    const { userId } = req.params;

    // to prevent infinite loops if there's a cycle
    const visited = new Set();

    // recursive function to build tree
    const buildTree = async (id) => {
      if (!id) return null; // base case: no child

      // if we already visited this node, stop recursion (avoid infinite loop)
      if (visited.has(id.toString())) return null;
      visited.add(id.toString());

      const user = await User.findById(id).select(
        "_id fullName email sponsor_code  referral_code leftChild rightChild region position"
      );
      if (!user) return null;
      return {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        region: user.region,
        sponsor_code: user.sponsor_code,
        referral_code: user.referral_code,
        leftChild: user.leftChild ? await buildTree(user.leftChild) : null,
        rightChild: user.rightChild ? await buildTree(user.rightChild) : null,
      };
    };

    const tree = await buildTree(userId);

    return res.status(200).json(tree);
  } catch (err) {
    console.error("Error in getUserTree:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;
  console.log(email);

  if (!email) {
    return res.status(400).json(new ApiError(400, null, "Email Is required"));
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, null, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiError(401, null, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json(new ApiError(401, null, "unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Invalid refresh token"));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Refresh token is expired or used"));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, null, error?.message || "Invalid refresh token"));
  }
});

export const getUsersReferredByMe = asyncHandler(async (req, res) => {
  const { referral_code } = req.params;

  try {
    const users = await User.find({ referredBy: referral_code });

    if (!users.length) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "No users found referred by this code")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiError(400, null, "Invalid old password"));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No users found"));
  }
  // Return the list of users
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

const getAllCenter = asyncHandler(async (req, res) => {
  const users = await User.find({ user_type: "center" });

  if (!users || users.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No center users found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All center users fetched successfully"));
});

const getAllParent = asyncHandler(async (req, res) => {
  const users = await User.find({ user_type: "user" });

  if (!users || users.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No parent users found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All parent users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Assuming you pass the user id in the request parameters

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new ApiResponse(200, null, "User deleted successfully"));
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id; // Assuming you pass the user ID in the URL params
  const {
    fullName,
    email,
    phone,
    password,
    username,
    referredBy,
    age,
    sex,
    image,
    education,
    city,
    state,
    country,
    region,
  } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email exists for another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApiError(409, "Email already exists");
      }
    }

    // Check if phone exists for another user
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        throw new ApiError(409, "Phone number already exists");
      }
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password || user.password;
    user.username = username || user.username;
    user.referredBy = referredBy || user.referredBy;
    user.age = age || user.age;
    user.sex = sex || user.sex;
    user.image = image || user.image;
    user.education = education || user.education;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.region = region || user.region;

    // Save updated user
    user = await user.save();

    // Return updated user
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    // Handle errors
    return next(error);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new ApiResponse(200, user, "User retrieved successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getAllUsers,
  getAllCenter,
  getAllParent,
  deleteUser,
  updateUser,
  getUserById,
  sendOTP,
  verifyOTP,
  upgradeUser,
  getUserTree,
};
