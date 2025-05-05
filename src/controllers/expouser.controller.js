import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ExpoUser } from "../models/expouser.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import csv from "csv-parser";
import { Readable } from "stream";
import { htmlContent } from "./content.js";
import { uploadFile } from "../utils/uploadFils.js";
import htmlToPdf from "html-pdf-node";
import { sendMessage } from "../utils/exp/sendMessage.js";
import puppeteer from "puppeteer";
import fs from "fs";
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

// const importExpoUsers = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json(new ApiError(400, "CSV file is required"));
//   }

//   let users = [];

//   const stream = Readable.from(req.file.buffer);

//   stream
//     .pipe(csv())
//     .on("data", (row) => {
//       users.push(row);
//     })
//     .on("end", async () => {
//       const report = [];

//       for (const user of users) {
//         try {
//           const {
//             name,
//             company,
//             phone,
//             city,
//             profile_pic,
//             userType,
//             email,
//             password,
//             state,
//             stall_number,
//           } = user;

//           if (!name || !phone || !city || !state || !userType) {
//             throw new Error(
//               "Required fields missing (name, phone, city, userType)"
//             );
//           }

//           const existingUser = await ExpoUser.findOne({ phone });
//           if (existingUser) {
//             throw new Error("Phone number already exists");
//           }

//           const id = await generateUniqueId();

//           const createdUser = new ExpoUser({
//             id,
//             name,
//             company,
//             phone,
//             city,
//             state,
//             profile_pic,
//             userType,
//             email,
//             password,
//             stall_number, // (ideally hash it if needed)
//           });

//           await createdUser.save();

//           if (createdUser) {
//             const html = htmlContent(createdUser);

//             try {
//               const browser = await puppeteer.launch({ headless: "new" });
//               const page = await browser.newPage();

//               await page.setContent(html, { waitUntil: "networkidle0" });

//               await page.setViewport({
//                 width: 350, 
//                 height: 500,
//                 deviceScaleFactor: 2, 
//               });

//               const imageBuffer = await page.screenshot({
//                 type: "png",
//                 fullPage: true,
//               });

//               await browser.close();

//               const key = `admitcards/${createdUser.id}-${Date.now()}.png`;
//               const s3Upload = await uploadFile({
//                 key,
//                 file: imageBuffer,
//                 contentType: "image/png",
//               });

//               const imageUrl = s3Upload.Location;

//               if (imageUrl) {
//                 await sendMessage(createdUser, imageUrl);
//                 createdUser.badge_image_url = imageUrl;
//               }

//               await createdUser.save();
//             } catch (error) {
//               console.error("Image generation failed:", error);
//             }
//           }

//           report.push({ phone, status: "success" });
//         } catch (error) {
//           report.push({
//             phone: user.phone,
//             status: "failed",
//             reason: error.message,
//           });
//         }
//       }

//       const summary = {
//         total: report.length,
//         success: report.filter((r) => r.status === "success").length,
//         failed: report.filter((r) => r.status === "failed").length,
//       };

//       return res.status(200).json({ summary, report });
//     });
// });
const importExpoUsers = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiError(400, "CSV file is required"));
  }

  const report = [];
  let browser; // Declare browser outside the loop

  try {
    // Launch browser once for all users
    browser = await puppeteer.launch({ headless: "new" });

    const stream = Readable.from(req.file.buffer);
    const csvStream = csv();

    let batch = [];
    const BATCH_SIZE = 10; // Process 10 users at a time

    for await (const user of stream.pipe(csvStream)) {
      try {
        const {
          name,
          company,
          phone,
          city,
          profile_pic,
          userType,
          email,
          password,
          state,
          stall_number,
        } = user;

        // Validate required fields
        if (!name || !phone || !city || !state || !userType) {
          throw new Error("Required fields missing (name, phone, city, state, userType)");
        }

        // Validate phone format
        if (!/^\d{10,15}$/.test(phone)) {
          throw new Error("Invalid phone number format");
        }

        // Check for existing user
        const existingUser = await ExpoUser.findOne({ phone });
        if (existingUser) {
          throw new Error("Phone number already exists");
        }

        // Generate ID and hash password
        const id = await generateUniqueId();
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Create user object
        const userData = {
          id,
          name: name.trim(),
          company: company?.trim(),
          phone: phone.trim(),
          city: city.trim(),
          state: state.trim(),
          profile_pic: profile_pic?.trim(),
          userType: userType.trim(),
          email: email?.trim(),
          password: hashedPassword,
          stall_number: stall_number?.trim(),
        };

        batch.push(userData);

        // Process batch when size is reached
        if (batch.length >= BATCH_SIZE) {
          await processBatch(batch, report, browser);
          batch = [];
        }
      } catch (error) {
        report.push({
          phone: user.phone || 'unknown',
          status: "failed",
          reason: error.message,
        });
      }
    }

    // Process remaining users in the last batch
    if (batch.length > 0) {
      await processBatch(batch, report, browser);
    }

    const summary = {
      total: report.length,
      success: report.filter((r) => r.status === "success").length,
      failed: report.filter((r) => r.status === "failed").length,
    };

    return res.status(200).json({ summary, report });
  } catch (error) {
    console.error("Import failed:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Helper function to process a batch of users
async function processBatch(users, report, browser) {
  const page = await browser.newPage();
  
  try {
    for (const userData of users) {
      try {
        const createdUser = await ExpoUser.create(userData);

        if (createdUser) {
          const html = htmlContent(createdUser);
          await page.setContent(html, { waitUntil: "networkidle0" });
          await page.setViewport({
            width: 350,
            height: 500,
            deviceScaleFactor: 2,
          });

          const imageBuffer = await page.screenshot({
            type: "png",
            fullPage: true,
          });

          const key = `admitcards/${createdUser.id}-${Date.now()}.png`;
          const s3Upload = await uploadFile({
            key,
            file: imageBuffer,
            contentType: "image/png",
          });

          if (s3Upload.Location) {
            await sendMessage(createdUser, s3Upload.Location);
            createdUser.badge_image_url = s3Upload.Location;
            await createdUser.save();
          }

          report.push({ phone: userData.phone, status: "success" });
        }
      } catch (error) {
        report.push({
          phone: userData.phone,
          status: "failed",
          reason: error.message,
        });
      }
    }
  } finally {
    await page.close();
  }
}

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
  const {
    name,
    company,
    phone,
    city,
    profile_pic,
    userType,
    email,
    password,
    state,
  } = req.body;

  // Validate required fields
  if (!name || !phone || !city || !state || !userType) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Fields (name, phone, city, userType) are required")
      );
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
    // this is use for pdf generation
    // if (createdUser) {
    //   const file = {
    //     content: htmlContent(createdUser),
    //   };
    //   const options = {
    //     width: '90mm',
    //     height: '120mm',
    //     printBackground: true,
    //     preferCSSPageSize: true,
    //     margin: {
    //       top: '0cm',
    //       right: '0cm',
    //       bottom: '0cm',
    //       left: '0cm',
    //     },
    //     scale: 0.9,
    //   };

    //   try {
    //     const pdfBuffer = await htmlToPdf.generatePdf(file, options);
    //     const key = `admitcards/${createdUser.id}-${Date.now()}.pdf`;

    //     const s3Upload = await uploadFile({
    //       key,
    //       file: pdfBuffer,
    //       contentType: "application/pdf",
    //     });

    //     const imageUrl = s3Upload.Location;

    //     if (imageUrl) {
    //       await sendMessage(createdUser, imageUrl);
    //       createdUser.badge_pdf_url = imageUrl;
    //     }

    //     await createdUser.save();
    //   } catch (pdfError) {
    //     console.error("PDF/S3 upload failed:", pdfError);
    //   }
    // }
    // this is use for image generation
    if (createdUser) {
      const html = htmlContent(createdUser);

      try {
        const browser = await puppeteer.launch({
          headless: "new", 
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        // Set viewport to your desired size (match your card size in px)
        await page.setViewport({
          width: 350, // Adjust based on your card width
          height: 500,
          deviceScaleFactor: 2, // Optional: higher quality
        });

        const imageBuffer = await page.screenshot({
          type: "png",
          fullPage: true,
        });

        await browser.close();

        const key = `admitcards/${createdUser.id}-${Date.now()}.png`;
        const s3Upload = await uploadFile({
          key,
          file: imageBuffer,
          contentType: "image/png",
        });

        const imageUrl = s3Upload.Location;

        if (imageUrl) {
          await sendMessage(createdUser, imageUrl);
          createdUser.badge_image_url = imageUrl;
        }

        await createdUser.save();
      } catch (error) {
        console.error("Image generation failed:", error);
      }
    }

    // Return success response
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    // Log the error for debugging
    console.error("Error registering user:", error);

    // Return a generic error response
    return res.status(500).json(new ApiError(500, "Internal server error"));
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

  const user = await ExpoUser.findOne({ phone });

  if (!user) {
    return res.status(400).json(new ApiError(400, "User not found"));
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

export {
  registerExpoUser,
  getAllExpoUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  importExpoUsers,
};
