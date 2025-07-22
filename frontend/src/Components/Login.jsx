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
            console.log(userData,"vvvvvvvvv");
            
            const response = await axios.post('http://localhost:8000/login', userData)
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
            <div className="bg-purple-400 flex justify-center align-middle" style={{ height: "100vh" }}>
                <div className="bg-white w-[50%] h-auto m-40 rounded-tl-[30%] rounded-br-[30%]">
                    <h1 className="text-purple text-center font-mono text-2xl m-5 ">Login</h1>
                    <div className=" w-[85%] m-auto p-5 mt-7">
                        <div >
                            <div className="flex justify-between">
                                <div className="w-[55%]">
                                    <div className="flex justify-between  mb-3">
                                        <label className="">Email: </label>
                                        <input type="email" name="email" value={userData.email} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                                    </div>

                                    <div className="flex justify-between align-middle mb-3">
                                        <label className="">Password: </label>
                                        <input type="password" name="password" value={userData.password} onChange={handleChange} className="border border-purple-400 rounded-xl focus:border-purple-400 outline-none px-4 py-1 text-sm" required />
                                    </div>

                                    <div className="flex justify-center items-center flex-col">
                                        <button onClick={() => handleSubmit()} type="submit" className="bg-purple-400 text-white outline-none cursor-pointer py-2 px-4 rounded-lg hover:bg-purple-600 my-3">Login</button>

                                    </div>
                                </div>

                                <div className="w-[35%] flex justify-start items-start flex-col">
                                    <p>Don't have account? <span onClick={() => navigate('/register')} className="text-purple-500 cursor-pointer hover:text-purple-800 ">Register here</span></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;