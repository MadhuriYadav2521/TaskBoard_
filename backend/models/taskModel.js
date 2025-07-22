import mongoose from "mongoose";
import { Schema } from "mongoose";


const taskSchema = new Schema({
    taskTitle : String,
    discription: String,
    grade: Number,
    subject: String,
    taskFileName: String,
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    deadlineDate: Date,
},{timestamps: true})

const Tasks = mongoose.model("Tasks", taskSchema)
export default Tasks;