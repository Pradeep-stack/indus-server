// import { Router } from "express";
// import {
//   loginUser,
//   logoutUser,
//   registerUser,
//   refreshAccessToken,
//   changeCurrentPassword,
//   getCurrentUser,
//   updateUserAvatar,
//   updateUserCoverImage,
//   getUserChannelProfile,
//   getWatchHistory,
//   updateAccountDetails,
//   getAllUsers,
//   getAllCenter,
//   getAllParent,
//   deleteUser,
//   updateUser,
//   getUserById,
//   getUsersReferredByMe,
//   sendOTP,
//   verifyOTP,
//   upgradeUser,
//   getUserTree
// } from "../controllers/user.controller.js";
// import { uploadSingle, uploadMultiple } from "../middlewares/multer.middleware.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js";


// const router = Router()

// router.route("/register").post(registerUser)
// router.route("/login").post(loginUser)
// router.route("/send-otp").post(sendOTP)
// router.route("/verify-otp").post(verifyOTP)
// router.route("/get-all-user").get(getAllUsers)// modify this api for the get associat for the associat
// router.route("/get-referral/:referral_code").get(getUsersReferredByMe)
// router.route("/get-admin").get(getAllCenter)
// router.route("/get-user").get(getAllParent)
// router.route("/delete-user/:id").delete(deleteUser)
// router.route("/update-user/:id").patch(updateUser)
// router.route("/user-by-id/:id").get(getUserById)

// //secured routes
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)
// // router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// // router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)

// // MLM routes
// router.route("/upgrade-user").post( upgradeUser)
// router.route("/user-tree/:userId").get( getUserTree)

// export default router


import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
  getAllUsers,
  getAllCenter,
  getAllParent,
  deleteUser,
  updateUser,
  getUserById,
  getUsersReferredByMe,
  sendOTP,
  verifyOTP,
  upgradeUser,
  getUserTree,
} from "../controllers/user.controller.js";
import { uploadSingle, uploadMultiple } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication APIs
 */


/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */


/**
 * @swagger
 * /api/v1/send-otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [Users]
 */

/**
 * @swagger
 * /api/v1/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Users]
 */


/**
 * @swagger
 * /api/v1/get-all-user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpgradeUserRequest:
 *       type: object
 *       required:
 *         - userId
 *         - packagePlan
 *         - sponserBy
 *         - position
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user to upgrade.
 *           example: "64e54b0f3e12ab2c1a5b1234"
 *         packagePlan:
 *           type: string
 *           description: The package plan for the user.
 *           enum: [package-1, package-2, package-3]
 *           example: "package-2"
 *         sponserBy:
 *           type: string
 *           description: The sponsor code of the user who referred this user.
 *           example: "IND1234567"
 *         underChild:
 *           type: string
 *           description: The sponsor code of the user under whom this user will be placed.
 *           example: "IND9876543"
 *         position:
 *           type: string
 *           description: The position under the parent (left/right).
 *           enum: [left, right]
 *           example: "left"
 *
 *     UpgradeUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User upgraded successfully"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             sponsor_code:
 *               type: string
 *             user_type:
 *               type: string
 *             position:
 *               type: string
 *             region:
 *               type: string
 *
 *     UserTreeResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64e54b0f3e12ab2c1a5b1234"
 *         name:
 *           type: string
 *           example: "Pradeep Kumar"
 *         email:
 *           type: string
 *           example: "pradeep@example.com"
 *         region:
 *           type: string
 *           example: "India"
 *         position:
 *           type: string
 *           example: "left"
 *         leftChild:
 *           $ref: '#/components/schemas/UserTreeResponse'
 *         rightChild:
 *           $ref: '#/components/schemas/UserTreeResponse'
 */

/**
 * @swagger
 * /api/v1/upgrade-user:
 *   post:
 *     summary: Upgrade a user's package and assign sponsor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpgradeUserRequest'
 *     responses:
 *       201:
 *         description: User upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpgradeUserResponse'
 *       400:
 *         description: Invalid request or missing fields
 *       404:
 *         description: User or Sponsor not found
 *       500:
 *         description: Something went wrong while upgrading the user
 */
/**
 * @swagger
 * /api/v1/user-tree/{userId}:
 *   get:
 *     summary: Get user's binary tree
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch tree for
 *     responses:
 *       200:
 *         description: Successfully fetched user tree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTreeResponse'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.route("/get-all-user").get(getAllUsers);

router.route("/get-referral/:referral_code").get(getUsersReferredByMe);

router.route("/get-admin").get(getAllCenter);

router.route("/get-user").get(getAllParent);

router.route("/delete-user/:id").delete(deleteUser);

router.route("/update-user/:id").patch(updateUser);

router.route("/user-by-id/:id").get(getUserById);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT, getWatchHistory);

router.post("/upgrade-user", upgradeUser);

router.get("/user-tree/:userId", getUserTree);

router.route("/send-otp").post(sendOTP);

router.route("/verify-otp").post(verifyOTP);

router.route("/login").post(loginUser);

router.route("/register").post(registerUser);


export default router;
