import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Chat from "./Chat";
import AddTask from "./AddTask";
import TeacherViewTasks from "./TeacherViewTasks";

const TeacherDashboard = () => {

    const [currentUser, setCurrentUser] = useState({});
    const [selectedTab, setSelectedTab] = useState("viewTask");
    const userData = JSON.parse(localStorage.getItem("sapuserData"))

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
    }, [])

    const selectTab = (tab) => {
        setSelectedTab(tab)
    }

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
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "addTask" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("addTask")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                                <p>Add Task</p>
                            </div>
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "viewTask" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("viewTask")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                                </svg>
                                <p>View Tasks</p>
                            </div>
                            <div className={`flex justify-center gap-4 border-2 border-gray-200 w-[25%] p-2 text-[14px] hover:bg-purple-200 cursor-pointer items-center ${selectedTab == "submissions" ? 'bg-purple-200' : ''}`} onClick={() => selectTab("submissions")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                                <p>Submissions</p>
                            </div>
                        </div>

                        {selectedTab == "addTask" &&
                            <AddTask />
                        }
                        {selectedTab == "viewTask" &&
                            <TeacherViewTasks />
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
export default TeacherDashboard;