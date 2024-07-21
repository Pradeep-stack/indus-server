import { Product } from "../models/product.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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