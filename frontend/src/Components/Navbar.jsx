import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BellRing from "./BellRing";

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
            const response = await axios.post('https://taskboard-sewf.onrender.com/fetchUsers')
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
            <div className="bg-purple-600 flex justify-between items-center px-4 sm:px-6 py-3 relative">
                {/* Logo */}
                <div className="text-white text-xl font-bold">TaskBoard</div>

                {/* Right Icons */}
                <div className="flex items-center space-x-4 relative">
                    {/* Bell Icon */}
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="white"
                            className={`transition-transform duration-500 ${animate ? 'rotate-12' : ''}`}
                            style={{
                                animation: animate ? 'swing 0.5s ease-in-out' : 'none',
                            }}
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-purple-300 text-black text-xs px-1.5 rounded-full shadow-md">
                            {unreadChatCount}
                        </span>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <img
                                src={
                                    currentUser?.profileImg
                                        ? `https://taskboard-sewf.onrender.com/uploads/${currentUser?.profileImg}`
                                        : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'
                                }
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {isOpen && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 text-sm">
                                <li className="px-4 py-2 font-semibold">{`${currentUser?.fName} ${currentUser?.lName}`}</li>
                                <li className="px-4 py-2 text-gray-600 border-t">{currentUser?.email}</li>
                                <li
                                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                                    onClick={handleShowProfile}
                                >
                                    Profile
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Profile Modal */}
                {showProfile && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white border rounded-lg shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Profile</h2>
                            <svg
                                onClick={() => {
                                    setShowProfile(false);
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 384 512"
                            >
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                            <div className="w-24 h-24 mx-auto sm:mx-0 rounded-full overflow-hidden border-2 border-gray-300">
                                <img
                                    src={
                                        currentUser?.profileImg
                                            ? `https://taskboard-sewf.onrender.com/uploads/${currentUser?.profileImg}`
                                            : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'
                                    }
                                    className="object-cover w-full h-full"
                                    alt="profile"
                                />
                            </div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-semibold">Name:</span> {currentUser?.fName} {currentUser?.lName}</p>
                                <p><span className="font-semibold">Email:</span> {currentUser?.email}</p>
                                <p><span className="font-semibold">Phone:</span> {currentUser?.phone}</p>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm border border-gray-200">
                            <tbody>
                                {currentUser?.grade && (
                                    <tr className="border-t">
                                        <td className="px-4 py-2 font-medium w-1/3">Grade</td>
                                        <td className="px-4 py-2">{currentUser?.grade}</td>
                                    </tr>
                                )}
                                <tr className="border-t">
                                    <td className="px-4 py-2 font-medium">Subjects</td>
                                    <td className="px-4 py-2">
                                        {currentUser?.subjects?.map((subject, i) => (
                                            <div key={i}>{i + 1}. {subject}</div>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </>
    )
}

export default Navbar;