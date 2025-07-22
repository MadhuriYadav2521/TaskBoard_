import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState({});
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    const { unreadChatCount } = useSelector((s) => s.chatReducer)

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const [animate, setAnimate] = useState(false);
    const [showProfile, setShowProfile] = useState(false)

    const handleShowProfile = () => {
        setIsOpen(false)
        setShowProfile(true)
    }

    useEffect(() => {
        setAnimate(true);
        const timeout = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timeout);
    }, [unreadChatCount]);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("sapuserData");
        localStorage.removeItem("sapToken");
        navigate("/")
    };


    const fetchUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/fetchUsers')
            if (response.data.status == 200) {
                const user = response.data.users.find((f) => f._id == userData?._id)
                setCurrentUser(user)
            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    console.log(currentUser, "currentUser");


    return (
        <>
            <div className="bg-purple-600 flex justify-between p-2 items-center px-11">
                <div className="bg-purple-600 text-white text-xl font-bold">
                    TaskBoard
                </div>
                <div className=" flex justify-end gap-2 items-center space-x-2 relative group">
                    <div className="relative mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="white"
                            className={`bi bi-bell-fill transition-transform duration-500 ${animate ? 'row-start-13 -rotate-12 hue-rotate-30 rota ' : ''
                                }`}
                            style={{
                                animation: animate ? 'swing 0.5s ease-in-out' : 'none',
                            }}
                            viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                        </svg>

                        <span className="absolute top-4 left-2 bg-purple-400 text-black shadow-2xl text-xs px-1.5 rounded-full">
                            {unreadChatCount}
                        </span>
                    </div>

                    <ul className="" ref={dropdownRef}>
                        <li className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                            <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer border-2 border-gray-600 overflow-hidden ">
                                <img src={currentUser?.profileImg ? `http://localhost:8000/uploads/${currentUser?.profileImg}` : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'} className="object-cover w-10 h-10 rounded-full" alt="" />
                            </div>

                        </li>

                        {isOpen && (
                            <ul className="absolute left-0 mt-2 p-2 bg-white shadow-2xl rounded   z-50">
                                <li className="relative px-1 py-1 " onClick={handleLogout}>
                                    <div className="text-nowrap text-sm font-semibold">{`${currentUser?.fName} ${currentUser?.lName}`}</div>
                                </li>
                                <li className=" border border-t-0 border-r-0 border-l-0 border-b-2 relative px-1 py-1">
                                    <div className="text-[12px]">{currentUser?.email}</div>
                                </li>
                                <li className="relative px-1 py-1 hover:bg-purple-200 cursor-pointer">
                                    <div className="text-nowrap text-[12]" onClick={() => handleShowProfile()}>Profile</div>
                                </li>
                                <li className="relative px-1 py-1 hover:bg-purple-200 cursor-pointer" onClick={handleLogout}>
                                    <div className="text-sm">Logout</div>
                                </li>
                            </ul>
                        )}
                    </ul>

                </div>

                {showProfile &&
                    <div className=" absolute w-[400px] top-20 left-1/3 m-auto border-2 border-gray-300 p-7 bg-white z-30">
                        <div className="w-full flex justify-between items-center mb-2">
                            <p className="font-bold text-[18px]">Profile</p>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { setShowProfile(false), setIsOpen(false) }} className='cursor-pointer text-red-600' width="18" height="18" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </div>

                        <div className="flex justify-between items-center">

                            <div className="m-auto w-[100px] h-[100px] rounded-full border-2 border-gray-300 overflow-hidden">
                                <img src={currentUser?.profileImg ? `http://localhost:8000/uploads/${currentUser?.profileImg}` : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'} className="object-cover w-full h-full rounded-full" alt="" />
                            </div>
                            <div className=" space-y-2">
                                <p><span className="font-bold">Name:</span> {currentUser?.fName} {currentUser?.lName}</p>
                                <p><span className="font-bold">Email:</span> {currentUser?.email}</p>
                                <p><span className="font-bold">Phone:</span> {currentUser?.phone}</p>

                            </div>
                        </div>

                        <div className="mt-7">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                <tbody>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700 w-1/3">Grade</td>
                                        <td className="px-4 py-3 text-gray-800">{currentUser?.grade}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Subjects</td>
                                        <td className="px-4 py-3 text-gray-800">{currentUser?.subjects?.map((p, i) => (
                                            <span className="block">{p}</span>
                                        ))}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                }
            </div>
        </>
    )
}

export default Navbar;