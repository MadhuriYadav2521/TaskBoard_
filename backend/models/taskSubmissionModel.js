import mongoose from "mongoose";
import { Schema } from "mongoose";

const assignedTo = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    submittedAt: Date,
    submissionFile: String,
    status: {
        type: String,
        enum : ["Pending", "Complete"],
        default: "Pending"
    },
    isOpened: {
        type: Boolean,
        default: false
    }
})

const submissionSchema = new Schema({
    taskId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks"
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    assignedTo: [assignedTo],
})

const TaskSubmissions = mongoose.model("TaskSubmissions", submissionSchema)
export default TaskSubmissions;