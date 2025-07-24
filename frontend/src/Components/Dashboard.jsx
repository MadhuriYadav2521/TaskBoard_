import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Chat from "./Chat";
import AddTask from "./AddTask";
import TeacherViewTasks from "./TeacherViewTasks";
import MyTasks from "./MyTasks";
import MySubmissions from "./MySubmissions";

const Dashboard = () => {

    const [currentUser, setCurrentUser] = useState({});
    const [selectedTab, setSelectedTab] = useState("MyTasks");
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    const [showNewTasks, setShowNewTasks] = useState(false)
    const [newTasks, setNewTasks] = useState([])

    const fetchUsers = async () => {
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
        fetchUsers()
        fetchTaskByStudentId()
    }, [])

    const selectTab = (tab) => {
        setSelectedTab(tab)
    }

    const fetchTaskByStudentId = async () => {
        try {
            const data = {
                studentId: userData?._id
            }
            const response = await axios.post('https://taskboard-sewf.onrender.com/fetchNewTask', data)

            if (response.data.status == 200) {
                setNewTasks(response?.data?.tasks)

            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }

    const handleMarkRead = async (taskId) => {
        try {
            const data = {
                studentId: userData?._id,
                taskId: taskId
            }
            const response = await axios.post('https://taskboard-sewf.onrender.com/markAsReadTask', data)
            console.log(response.data, "lllllllll");

            if (response.data.status == 200) {
                fetchTaskByStudentId()
            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }
    console.log(newTasks, "newTasks");

    return (
        <>


            <div className="flex flex-col min-h-screen">
                <Navbar />

                {/* Main content */}
                <div className="flex flex-1 flex-col lg:flex-row bg-purple-200 overflow-y-auto">
                    {/* Sidebar and Tabs */}
                    <div className="w-full lg:w-[70%] bg-gray-100 border-r-4">
                        <div className="flex flex-wrap justify-around border-2 border-gray-200">
                            {/* Tab Buttons */}
                            {["stats", "MyTasks", "MySubmissions"].map((tab) => (
                                <div
                                    key={tab}
                                    className={`flex justify-center gap-4 border-2 border-gray-200 w-1/2 sm:w-[30%] lg:w-[25%] p-2 text-sm hover:bg-purple-200 cursor-pointer items-center ${selectedTab === tab ? "bg-purple-200" : ""}`}
                                    onClick={() => selectTab(tab)}
                                >
                                    <p className="capitalize">{tab}</p>
                                </div>
                            ))}

                            {/* New Tasks Tab */}
                            <div
                                className="flex justify-center gap-4 border-2 border-gray-200 w-1/2 sm:w-[30%] lg:w-[25%] p-2 text-sm hover:bg-purple-200 cursor-pointer items-center relative"
                                onClick={() => setShowNewTasks(true)}
                            >
                                <p>New Tasks</p>
                            </div>

                            {/* Popup Table */}
                            {showNewTasks && (
                                <div className="w-[90%] sm:w-[80%] lg:w-[60%] absolute top-[100px] z-20 bg-white shadow-lg border-2 border-gray-300 p-4">
                                    <div className="flex justify-end p-3">
                                        <button
                                            className="text-red-600 cursor-pointer"
                                            onClick={() => setShowNewTasks(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-2 border-gray-400">
                                            <thead>
                                                <tr className="border-2">
                                                    <th className="border-2 border-gray-300 py-1 px-2">Sr.No.</th>
                                                    <th className="border-2 border-gray-300 py-1 px-2">Task Title</th>
                                                    <th className="border-2 border-gray-300 py-1 px-2">Subject</th>
                                                    <th className="border-2 border-gray-300 py-1 px-2">Deadline</th>
                                                    <th className="border-2 border-gray-300 py-1 px-2">Mark as read</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newTasks?.length > 0 ? (
                                                    newTasks.map((n, i) => (
                                                        <tr
                                                            key={i}
                                                            className="border-2 hover:bg-purple-200 cursor-pointer"
                                                            onClick={() => handleMarkRead(n.taskId._id)}
                                                        >
                                                            <td className="border-2 border-gray-300 py-1 px-2">{i + 1}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.taskTitle}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.subject}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.deadlineDate}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2 text-center">✔</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-2">
                                                            No task
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Conditional Tab Display */}
                        {selectedTab === "MyTasks" && <MyTasks />}
                        {selectedTab === "MySubmissions" && <MySubmissions />}
                    </div>

                    {/* Chat Section */}
                    <div className="w-full lg:w-[30%] p-4 bg-gray-100">
                        <Chat />
                    </div>
                </div>
            </div>



        </>
    )
}
export default Dashboard;