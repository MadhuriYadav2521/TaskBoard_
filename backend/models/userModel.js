import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    phone: Number,
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    profileImg: String,
    grade: String,
    subjects: []
},{timestamps: true})

const Users = mongoose.model('Users', userSchema)
export default Users;