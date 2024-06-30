import { Task } from "../models/task.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a task
// router.post('/', async (req, res) => {
    export const addTask = asyncHandler(async (req, res) => {
    const { columnId, content } = req.body;
    try {
      const task = new Task({ columnId, content });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get all tasks
//   router.get('/', async (req, res) => {
    export const getAllTask = asyncHandler(async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update a task
//   router.put('/:id', async (req, res) => {
    export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { columnId, content } = req.body;
    try {
      const task = await Task.findByIdAndUpdate(id, { columnId, content }, { new: true });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a task
//   router.delete('/:id', async (req, res) => {
    export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  