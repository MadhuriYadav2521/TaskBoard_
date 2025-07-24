import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [userData, setUserData] = useState({ email: "", password: "" })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async () => {
        try {
            if (!userData.email || !userData.password) {
                return alert("All field are required.")
            }
            console.log(userData, "vvvvvvvvv");

            const response = await axios.post('https://taskboard-sewf.onrender.com/login', userData)
            console.log(response, "cccccc");
            if (response.data.success == false) {
                return alert(`${response.data.message}`)
            } else if (response.data.success == true) {
                localStorage.setItem('sapToken', JSON.stringify(response.data.token))
                localStorage.setItem('sapuserData', JSON.stringify(response.data.userData))
                // alert(`${response.data.message}`)
                const userRole = response.data.userData.role
                if (userRole == "student") {
                    navigate('/studentDash')
                } else {
                    navigate('/teacherDash')
                }


            } else {
                alert("Error in login.")
            }


        } catch (error) {
            console.log(error);
            alert("Internal server error.")

        }
    }
    console.log(userData, "userData");


    return (
        <>
            <div className="bg-purple-400 flex justify-center items-center min-h-screen px-4">
                <div className="bg-white w-full max-w-3xl rounded-tl-[15%] rounded-br-[15%] p-6 md:p-12">
                    <h1 className="text-purple-700 text-center font-mono text-2xl mb-6">Login</h1>
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* Left side form */}
                            <div className="w-full md:w-1/2">
                                <div className="mb-4">
                                    <label className="block mb-1">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="w-full border border-purple-400 rounded-xl focus:border-purple-600 outline-none px-4 py-2 text-sm"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-1">Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        className="w-full border border-purple-400 rounded-xl focus:border-purple-600 outline-none px-4 py-2 text-sm"
                                        required
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>

                            {/* Right side register link */}
                            <div className="w-full md:w-1/2 flex items-center justify-center text-center">
                                <p className="text-sm">
                                    Don't have an account?{" "}
                                    <span
                                        onClick={() => navigate("/register")}
                                        className="text-purple-600 cursor-pointer hover:text-purple-800"
                                    >
                                        Register here
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Login;