import { Product } from "../models/product.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Purchase } from "../models/purchase.model.js";
export const addProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const product = await Product.create(data);
    return res
      .status(201)
      .json(new ApiResponse(200, product, "product Addedd Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();
    return res
      .status(201)
      .json(new ApiResponse(200, product, "Get product Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

// Get packages by region
export const getProductByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const product = await Product.find({ region });
    if (!product.length) return res.status(404).json({ message: "No Product found in this region" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
      const deleteVideo = await Product.findByIdAndDelete(id);

      if (!deleteVideo) {
          return res.status(404).json(
              new ApiResponse(404, null, "product not found")
          );
      }

      return res.status(200).json(
          new ApiResponse(200, {}, "product deleted successfully")
      );
  } catch (error) {
      return res.status(500).json(
          new ApiResponse(500, null, error.message)
      );
  }
});

// Buy Product Function
export const buyProduct = asyncHandler(async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    // Create the purchase record
    const purchase = await Purchase.create({ productId: productId, quantity: quantity, userId: userId });

    return res.status(200).json(new ApiResponse(200, purchase, "Product purchased successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// Get Purchased Products by User ID
export const getPurchasesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ userId: userId }).populate('productId');

    if (!purchases.length) {
      return res.status(404).json(new ApiResponse(404, null, "No purchases found for this user"));
    }

    return res.status(200).json(new ApiResponse(200, purchases, "Purchases retrieved successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// Get All Purchased Products
export const getAllPurchases = asyncHandler(async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('productId').populate('userId');

    return res.status(200).json(new ApiResponse(200, purchases, "All purchases retrieved successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});