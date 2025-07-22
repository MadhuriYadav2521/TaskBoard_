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
            const response = await axios.post('http://localhost:8000/fetchNewTask', data)

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
                taskId : taskId
            }
            const response = await axios.post('http://localhost:8000/markAsReadTask', data)
            console.log(response.data,"lllllllll");
            
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

            <div className=" flex flex-col" style={{ height: "100vh" }}>
                <Navbar />
                <div className="flex flex-1 bg-purple-200 ">
                    <div className="w-[70%] bg-gray-100 border-r-4">
                        <div className="flex justify-around border-2 border-gray-200">
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "stats" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("stats")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5" />
                                </svg>
                                <p>Stats</p>
                            </div>
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "MyTasks" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("MyTasks")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                </svg>
                                <p>My Tasks</p>
                            </div>
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "MySubmissions" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("MySubmissions")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                                <p>My Submissions</p>
                            </div>

                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center relative`} onClick={() => setShowNewTasks(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 512 512"><path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" /></svg>
                                <p>New Tasks</p>
                            </div>
                            {showNewTasks &&
                                <div className="w-[60%] absolute top-[100px] z-20 m-auto  bg-white shadow-lg border-2 border-gray-300 p-4">
                                    <div className="flex justify-end p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-red-600 cursor-pointer" width="18" height="18" fill="currentColor" onClick={() => setShowNewTasks(false)} viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                    </div>
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
                                                <>
                                                    {newTasks?.map((n, i) => (
                                                        <tr className="border-2 hover:bg-purple-200 cursor-pointer" onClick={() => handleMarkRead(n.taskId._id)}>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{i + 1}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.taskTitle}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.subject}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2">{n.taskId.deadlineDate}</td>
                                                            <td className="border-2 border-gray-300 py-1 px-2 text-center">✔</td>
                                                        </tr>
                                                    ))}
                                                </>) : (
                                                <td>No task</td>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>

                        {selectedTab == "MyTasks" &&
                            <MyTasks />
                        }
                        {selectedTab == "MySubmissions" &&
                            <MySubmissions />
                        }
                    </div>

                    <div className="w-[30%]  p-4 bg-gray-100">

                        <Chat />

                    </div>
                </div>
            </div>


        </>
    )
}
export default Dashboard;