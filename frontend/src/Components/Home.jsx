import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null);
    const [userData, setUserData] = useState({
        fName: "", lName: "", email: "", password: "", role: "", phone: "", profileImg: "", grade: "", subjects: []
    })
    const grades = [
        { name: 1, value: 1 },
        { name: 2, value: 2 },
        { name: 3, value: 3 },
        { name: 4, value: 4 },
        { name: 5, value: 5 },
    ]
    const subjectsList = ["Mathematics", "Science", "English", "Social Studies", "Art"];
    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target
        if (type === "checkbox" && name === "subjects") {
            const subjectArray = checked ? [...userData.subjects, value] : userData.subjects.filter((f) => f !== value)
            setUserData({ ...userData, subjects: subjectArray })

        } else if (type == "file") {
            setUserData((prev) => ({ ...prev, [name]: files[0] }))
        } else {
            setUserData((prev) => ({ ...prev, [name]: value }));
        }

    }

    const handleSubmit = async () => {
        try {
            if (!userData.fName || !userData.lName || !userData.email || !userData.password || !userData.phone || !userData.role
                || !userData.profileImg || !userData.subjects) {
                return alert("All field are required.")
            }
            if (userData.role == 'student' && !userData.grade) {

                return alert("Please select grade.")
            }
            const formData = new FormData();

            formData.append("fName", userData.fName);
            formData.append("lName", userData.lName);
            formData.append("email", userData.email);
            formData.append("password", userData.password);
            formData.append("phone", userData.phone);
            formData.append("role", userData.role);
            formData.append("profileImg", userData.profileImg);
            formData.append("grade", userData.grade);
            userData.subjects.forEach(sub => { formData.append("subjects[]", sub) })

            const response = await axios.post('https://taskboard-sewf.onrender.com/registerUser', formData)
            if (response.status == 200) {
                alert("Registration successfull")
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                setUserData({ fName: "", lName: "", email: "", password: "", role: "", phone: "", profileImg: "", grade: "", subjects: [] })
                navigate('/')
            } else {
                alert("Error in register.")
            }


        } catch (error) {
            console.log(error);
            alert("Internal server error.")

        }
    }
    console.log(userData, "userData");


    return (
        <>
            <div className="bg-purple-400 flex justify-center items-center min-h-screen px-4 py-8">
                <div className="w-full md:w-[90%] lg:w-[60%] rounded-tl-[15%] md:rounded-tl-[30%] rounded-br-[15%] md:rounded-br-[30%] shadow-lg bg-white overflow-hidden">

                    <div className="flex flex-col md:flex-row h-full">

                        {/* Left Section */}
                        <div className="w-full md:w-1/2 py-6 px-6 md:px-10 bg-white">
                            <h1 className="text-purple-700 text-center font-mono text-2xl mb-6">Register</h1>

                            {/** Form Inputs */}
                            {[
                                { label: "First Name", name: "fName", type: "text" },
                                { label: "Last Name", name: "lName", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Password", name: "password", type: "password" },
                                { label: "Phone", name: "phone", type: "number" },
                            ].map(({ label, name, type }) => (
                                <div key={name} className="flex justify-between items-center mb-3">
                                    <label className="mr-2">{label}:</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={userData[name]}
                                        onChange={handleChange}
                                        className="w-[66%] border border-purple-400 rounded-xl px-4 py-1 text-sm outline-none focus:border-purple-600"
                                        required
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col items-center mt-6">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    Register
                                </button>
                                <p className="mt-4 text-sm">
                                    Already have account?{" "}
                                    <span
                                        onClick={() => navigate('/')}
                                        className="text-purple-700 cursor-pointer hover:text-purple-800"
                                    >
                                        Log in here
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-full md:w-1/2 py-6 px-6 md:px-10 bg-white">
                            <div className="space-y-4">

                                {/* Role */}
                                <div className="flex justify-between items-center">
                                    <label>Select Role:</label>
                                    <select
                                        name="role"
                                        value={userData.role}
                                        onChange={handleChange}
                                        className="w-[66%] border border-purple-400 rounded-xl px-4 py-1 outline-none focus:border-purple-600"
                                        required
                                    >
                                        <option value="" disabled>Select your role</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>

                                {/* Profile Upload */}
                                <div className="flex justify-between items-center">
                                    <label>Profile:</label>
                                    <input
                                        type="file"
                                        name="profileImg"
                                        onChange={handleChange}
                                        ref={fileInputRef}
                                        className="w-[66%] border border-purple-400 rounded-xl px-2 py-1 text-sm outline-none"
                                        required
                                    />
                                </div>

                                {/* Grade (only if student) */}
                                {userData.role === "student" && (
                                    <div className="flex justify-between items-center">
                                        <label>Grade:</label>
                                        <select
                                            name="grade"
                                            value={userData.grade}
                                            onChange={handleChange}
                                            className="w-[66%] border border-purple-400 rounded-xl px-4 py-1 outline-none focus:border-purple-600"
                                            required
                                        >
                                            <option value="" disabled>Select your grade</option>
                                            {grades.map((g) => (
                                                <option key={g.value} value={g.value}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Subjects */}
                                <div>
                                    <label>Subjects:</label>
                                    <div className="grid grid-cols-2 gap-x-4 pl-4 mt-1">
                                        {subjectsList.map((subject) => (
                                            <label key={subject} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="subjects"
                                                    value={subject}
                                                    onChange={handleChange}
                                                    checked={userData.subjects.includes(subject)}
                                                    className="accent-purple-600 border-purple-400 rounded"
                                                />
                                                <span>{subject}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Image */}
                                <img
                                    src="https://cdni.iconscout.com/illustration/premium/thumb/teacher-and-student-doing-discussion-illustration-download-in-svg-png-gif-file-formats--meeting-educational-academic-teachers-casual-talk-e-learning-education-pack-school-illustrations-3733195.png?f=webp"
                                    alt="Illustration"
                                    className="w-full max-h-[200px] object-contain mt-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Home;