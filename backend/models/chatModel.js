import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    receiverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    message: String,
    read : {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Chats = mongoose.model("Chats", chatSchema)
export default Chats;