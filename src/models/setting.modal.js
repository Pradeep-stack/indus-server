// models/setting.model.js
import mongoose from 'mongoose';

const singleObjectSchema = new mongoose.Schema({
  optionOne: { type: String, required: true },
  optionTwo: { type: String, required: true },
  optionThree: { type: String, required: true },
  optionFour: { type: String, required: true },  
});

export const SingleObject = mongoose.model('SingleObject', singleObjectSchema);
