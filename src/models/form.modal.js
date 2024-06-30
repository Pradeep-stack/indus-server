import mongoose from "mongoose";
const { Schema } = mongoose;

const formSchema = new Schema({
    childName: {
        type: String,
        required: true 
    },
    age: {
        type: Number,
        required: true 
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'] 
    },
    grade: {
        type: String 
    },
    email: {
        type: String,
        required: true 
    },
    contact: {
        type: Number 
    },
    emergencyContact: {
        type: Number 
    },
    centerId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    mother:{
        type: String,
        // required:true  
    },
    motherName:{
        type: String,
        // required:true  
    },
    fatherName:{
        type: String,
        // required:true  
    },
    homeAddress:{
        type: String,
        // required:true  
    },
    city:{
        type: String,
        // required:true  
    },
    postlCode: {
        type: String 
    },
    address: {
        type: String 
    },
    funding: {
        type: String,
        enum: ['Yes', 'No'] 
    },
    admissionDate: {
        type: Date,
        default: Date.now 
    },
   status:{
    type: String ,
    default:"pending"
   }
   
}, {
    timestamps: true
});

export const Form = mongoose.model("Form", formSchema);
