import Users from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { fName, lName, email, password, phone, role, grade,  } = req.body

        const subjects = [ 'Mathematics', 'English', 'Art', 'Science', 'Social Studies' ]

        if (!fName || !lName || !email || !password || !phone || !role || !subjects) return res.status(400).json({ status: 400, message: "All fields are required." })

        if (role == 'student' && !grade) return res.status(400).json({ message: "All fields are required." })
        console.log(req.body, "ccccccccccc");

        const profileImgFile = req.files?.profileImg?.[0];
        console.log(profileImgFile, "profileImgFile");

        const profileImg = profileImgFile ? profileImgFile.path : "";  // Cloudinary URL
        console.log(profileImg, "profileImg");


        const isExist = await Users.findOne({ email }).exec()
        if (isExist) return res.status(400).json({ status: 400, message: "User alredy exist." })

        const formattedPassword = await bcrypt.hash(password, 10)

        const newUser = new Users({
            fName, lName, email, password: formattedPassword, phone, role,
            profileImg, grade: role == "student" ? grade : "", subjects
        })
        await newUser.save()

        if (!newUser) return res.status(400).json({ status: 400, message: "Error in saving user data." })
        return res.status(200).json({ status: 200, message: "Registartion successful", user: newUser })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: "Internal sercer error" })
    }
}

export const login = async (req, res) => {
    try {
        console.log(req.body, "bbbbbbbbbbbbbbbbbbbbbbk");

        const { email, password } = req.body
        if (!email || !password) return res.status(200).json({ status: 200, success: false, message: "All fields are required." })
        const isExist = await Users.findOne({ email }).exec()
        if (!isExist) return res.status(200).json({ status: 200, success: false, message: "User does not exist." })
        const decryptPassword = await bcrypt.compare(password, isExist.password)
        if (!decryptPassword) return res.status(200).json({ status: 200, success: false, message: "Credentials not matched." })
        const userData = { id: isExist._id, role: isExist.role, email: isExist.email }
        const token = jwt.sign(userData, 'secret')
        return res.status(200).json({ status: 200, message: "Login successful", success: true, token, userData: isExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: "Internal sercer error" })
    }
}

export const fetchALlUsers = async (req, res) => {
    try {
        // console.log(req.body,"bbhh")
        // const {role} = req.body
        // if(role !== "teacher" && role !== "student") return res.status(400).json({status: 400, message: "Invalid role."})
        let allUsers
        // if(role == "teacher"){
        //     allUsers = await Users.find({role: "student"}).exec()
        // }else{
        //     allUsers = await Users.find({role: "teacher"}).exec()
        // }
        allUsers = await Users.find().exec()
        if (!allUsers) return res.status(400).json({ status: 400, message: "No data found" })
        return res.status(200).json({ status: 200, message: `user data fetched successfully.`, users: allUsers })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: "Internal sercer error" })
    }
}

export const currentUser = async (req, res) => {
    try {
        console.log(req.body, "cccczzzz");

        const { userId } = req.body
        const user = await Users.findById(userId).exec()
        if (!user) return res.status(400).json({ status: 400, message: "User details not found." })
        return res.status(200).json({ status: 200, message: "User data fetched.", user })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: "Internal sercer error" })
    }
}


export const fetchUsersByPagination = async (req, res) => {
    try {
        
        let { pageNo, limit, } = req.body

        pageNo = parseInt(pageNo) || 1;
        limit = parseInt(limit) || 10;

        const skip = (pageNo - 1) * limit

        const totalRecords = await Users.countDocuments() 

        const allUsers = await Users.find().skip(skip).limit(limit).exec()

        if (!allUsers) return res.status(400).json({ status: 400, message: "No data found" })

        return res.status(200).json({
            status: 200,
            message: `user data fetched successfully.`,
            users: allUsers,
            pagination: {
                currentPAge : pageNo,
                limit,
                totalRecords,
                totalPages : Math.ceil(totalRecords/limit)
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: "Internal sercer error" })
    }
}