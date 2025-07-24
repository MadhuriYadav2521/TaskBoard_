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
            if(userData.role == 'student' &&  !userData.grade){
                
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
            <div className="bg-purple-400 flex justify-center align-middle" style={{ height: "100vh" }}>
                <div className=" w-[60%]  m-20 mt-12 rounded-tl-[30%] rounded-br-[30%]">

                    <div className="flex  h-full ">

                        <div className="w-[50%] bg-white rounded-tl-[30%] py-4 px-10  shadow-sm"  >
                            <h1 className="text-purple text-center font-mono text-2xl m-3">Register</h1>
                            <div className="flex justify-between  mb-3">
                                <label className="mr-2">First Name: </label>
                                <input type="text" name="fName" value={userData.fName} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                            </div>

                            <div className="flex justify-between  mb-3">
                                <label className="mr-2">Last Name: </label>
                                <input type="text" name="lName" value={userData.lName} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                            </div>

                            <div className="flex justify-between  mb-3">
                                <label className="">Email: </label>
                                <input type="email" name="email" value={userData.email} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                            </div>

                            <div className="flex justify-between align-middle mb-3">
                                <label className="">Password: </label>
                                <input type="password" name="password" value={userData.password} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                            </div>

                            <div className="flex justify-between  mb-3">
                                <label className="">Phone: </label>
                                <input type="number" name="phone" value={userData.phone} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                            </div>

                            <div className="flex justify-center items-center flex-col mt-10">
                                <button onClick={() => handleSubmit()} type="submit" className="bg-purple-400 text-white outline-none cursor-pointer py-2 px-4 rounded-lg hover:bg-purple-600 my-3">Register</button>

                            </div>
                            <div className=" flex justify-center items-center flex-col mt-5 ">
                                <p>Already have account? <span onClick={() => navigate('/')} className="text-purple-500 cursor-pointer hover:text-purple-800 ">Log in here</span></p>
                            </div>
                        </div>

                        <div className="w-[50%] h-full bg-white rounded-br-[30%] overflow-hidden py-4 px-10 drop-shadow-[0_8px_6px_rgba(0,0,0,0.2)]">


                            <div className="mt-14">


                                <div className="flex justify-between align-middle  mb-3">
                                    <label className="">Select Role: </label>
                                    <select name="role" value={userData.role} onChange={handleChange} className="w-[66%] border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 pt-1 pb-2 " required>
                                        <option value="" disabled>
                                            Select your role
                                        </option>
                                        <option value="teacher">Teacher</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>

                                <div className="flex justify-between  mb-3">
                                    <label className="">Profile: </label>
                                    <input
                                        type="file"
                                        name="profileImg"
                                        onChange={handleChange}
                                        ref={fileInputRef} //clear onsubmit
                                        className="w-[66%] border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-1 pt-1 pb-2 text-sm" required />
                                </div>

                                {userData?.role == 'student' &&
                                    <div className="flex justify-between align-middle  mb-3">
                                        <label className="">Grade: </label>
                                        <select name="grade" value={userData.grade} onChange={handleChange} className="w-[66%] border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 pt-1 pb-2 " required>
                                            <option value="" disabled>
                                            Select your grade
                                        </option>
                                            {grades.map((g) => (
                                                <option value={g.value}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                }

                                <div className="flex align-middle">
                                    <label className="">Subjects: </label>
                                    <div className="ml-10">
                                        {subjectsList.map((subject) => (
                                            <div div className="">
                                                <input
                                                    type="checkbox"
                                                    name="subjects"
                                                    value={subject}
                                                    onChange={handleChange}
                                                    checked={userData.subjects.includes(subject)}
                                                    className="w-4 h-4 accent-purple-600 border-purple-400 rounded focus:ring-purple-300"
                                                />
                                                <label className="ml-2">{subject}</label> <br />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <img src="https://cdni.iconscout.com/illustration/premium/thumb/teacher-and-student-doing-discussion-illustration-download-in-svg-png-gif-file-formats--meeting-educational-academic-teachers-casual-talk-e-learning-education-pack-school-illustrations-3733195.png?f=webp" alt="" className=" h-full w-full object-contain bg-white rounded-br-[30%] " />
                            </div>


                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Home;