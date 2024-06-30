import mongoose ,{Schema} from 'mongoose'

const testmonialSchema= new Schema ({
    postTitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    contant:{
        type:String,
        required:true
    },
    cover:{
        type:String,//for the image
        required:true
    },
    tag:{
        type:String,
    },
    metaTag:{
        type:String,
    },
    metaDescription:{
        type:String,
    },
    metaKeyword:{
        type:String,
    },
    enableComments:{
        type:Boolean,
        default:false
    },
    publis:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})

export const Testimonial= mongoose.model("Testimonial", testmonialSchema)