import { Column } from "../models/column.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

  // Create a column
// router.post('/', async (req, res) => {
    export const addColumn = asyncHandler(async (req, res) => {
    const { title } = req.body;
    try {
      const column = new Column({ title });
      await column.save();
      res.status(201).json(column);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get all columns
//   router.get('/', async (req, res) => {
    export const getAllColumn = asyncHandler(async (req, res) => {
    try {
      const columns = await Column.find();
      res.status(200).json(columns);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update a column
//   router.put('/:id', async (req, res) => {
    export const updateColumn = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
      const column = await Column.findByIdAndUpdate(id, { title }, { new: true });
      if (!column) return res.status(404).json({ message: 'Column not found' });
      res.status(200).json(column);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a column
//   router.delete('/:id', async (req, res) => {
    export const deleteColumn = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const column = await Column.findByIdAndDelete(id);
      if (!column) return res.status(404).json({ message: 'Column not found' });
      res.status(200).json({ message: 'Column deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  