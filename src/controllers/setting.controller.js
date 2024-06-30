import { SingleObject } from "../models/setting.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// Route to get the single object
export const getObject = asyncHandler(async (req, res) => {
  res.json(req.singleObject);
});

// Route to update the single object

export const updateObject = asyncHandler(async (req, res) => {
  const { optionOne, optionTwo, optionThree, optionFour } = req.body;

  if (!optionOne || !optionTwo || !optionThree || !optionFour) {
    return res.status(400).json({ error: "All options are required." });
  }

  req.singleObject.optionOne = optionOne;
  req.singleObject.optionTwo = optionTwo;
  req.singleObject.optionThree = optionThree;
  req.singleObject.optionFour = optionFour;

  try {
    await req.singleObject.save();
    res.json(req.singleObject);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the object." });
  }
});
