import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const TeacherViewTasks = () => {

    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    console.log(userData, "userData");
    const [taskData, setTaskData] = useState([])
    const [filters, setFilters] = useState({
        userId: userData?._id, taskTitle: "", discription: "", grade: "", subject: "", createdAt: "", deadlineDate: ""
    })
    const grades = [
        { name: 1, value: 1 },
        { name: 2, value: 2 },
        { name: 3, value: 3 },
        { name: 4, value: 4 },
        { name: 5, value: 5 },
    ]
    const [showFilters, setShowFilters] = useState(false)
    console.log(filters, "filters");

    const getTaskData = async () => {
        try {
            const response = await axios.post('https://taskboard-sewf.onrender.com/getAllTasks', filters)
            console.log(response.data.success, "bbbbbbbbbbbbbbbbbbb");

            if (response.data.success == true) {
                console.log(response.data.tasks, "xxx");
                setTaskData(response.data.tasks)
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")

        }
    }
    useEffect(() => {
        getTaskData()
    }, [])
    console.log(taskData, "taskData");

    const handleAddFilters = () => {
        setShowFilters(false)
        getTaskData()
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (type == "checkbox") {
            const fSubjects = checked ? [...filters.subject, value] : filters.subject.filter((f) => f !== value)
            setFilters({ ...filters, subject: fSubjects })
        } else {
            setFilters({ ...filters, [name]: value })
        }
    }

    const handleClearFilter = () => {
        setFilters({
            userId: userData?._id, taskTitle: "", discription: "", grade: "", subject: "", createdAt: "", deadlineDate: ""
        })
        setShowFilters(false)
        // Wait a tick for state to update
        setTimeout(() => {
            getTaskData();
        }, 1000);
    }

    return (
        <>
            <div className="w-full  bg-white p-4 overflow-x-auto relative ">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-2xl font-semibold">Tasks</p>
                    <button type="submit" onClick={() => setShowFilters(true)} className="bg-purple-500 text-white font-semibold px-8 py-2  rounded hover:bg-purple-600 transition">
                        Filter
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto ">
                    <table className="min-w-full border-2 border-gray-300 p-3">
                        <thead className="sticky top-0 z-10 w-full">
                            <tr className="border-2 border-gray-300 p-3 bg-purple-300">
                                <th className="border-2 border-gray-300 p-3">SR.No.</th>
                                <th className="border-2 border-gray-300 p-3">Title</th>
                                <th className="border-2 border-gray-300 p-3">Discription</th>
                                <th className="border-2 border-gray-300 p-3">Subject</th>
                                <th className="border-2 border-gray-300 p-3">Grade</th>
                                <th className="border-2 border-gray-300 p-3">File</th>
                                <th className="border-2 border-gray-300 p-3">Created At</th>
                                <th className="border-2 border-gray-300 p-3">Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskData?.map((t, i) => (
                                <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer">
                                    <td className="border-2 border-gray-300 p-3">{i + 1}</td>
                                    <td className="border-2 border-gray-300 p-3">{t.taskTitle}</td>
                                    <td className="border-2 border-gray-300 p-3">{t.discription}</td>
                                    <td className="border-2 border-gray-300 p-3">{t.subject}</td>
                                    <td className="border-2 border-gray-300 p-3">{t.grade}</td>
                                    <td className="text-ellipsis border-2 border-gray-300 p-3">{t.taskFileName}</td>
                                    <td className="border-2 border-gray-300 p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="border-2 border-gray-300 p-3">{new Date(t.deadlineDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showFilters &&
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] z-10 p-5 shadow-lg bg-white border-2 border-gray-300">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[18px] font-semibold ">Filter By</p>
                            <div className="cursor-pointer" onClick={() => setShowFilters(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[18px] h-[18px] text-red-500" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Section */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block font-medium ">Title:</label>
                                    <input type="text" name="taskTitle" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={filters.taskTitle} />
                                </div>
                                <div>
                                    <label className="block font-medium ">Description:</label>
                                    <input type="text" name="discription" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={filters.discription} />
                                </div>

                                <div>
                                    <label className="block font-medium ">Created Date:</label>
                                    <input type="date" name="createdAt" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={filters.createdAt} />
                                </div>

                                <div>
                                    <label className="block font-medium ">Deadline Date:</label>
                                    <input type="date" name="deadlineDate" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={filters.deadlineDate} />
                                </div>

                            </div>

                            {/* Right Section */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block font-medium ">Select Grade:</label>
                                    <select className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" name="grade" onChange={handleChange} value={filters.grade}>
                                        <option value="" selected disabled>Select grade</option>
                                        {grades.map((g) => (
                                            <option value={g.value}>{g.name}</option>
                                        ))}

                                    </select>

                                </div>
                                <div>
                                    <label className="block font-medium  mb-2">Subjects:</label>
                                    <div className="space-y-2">
                                        {userData?.subjects?.map((subject) => (
                                            <div key={subject} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name={subject}
                                                    value={subject}
                                                    className="mr-2 accent-purple-600 border-purple-400 rounded focus:ring-purple-300"
                                                    onChange={handleChange}
                                                    checked={filters.subject.includes(subject)}
                                                />
                                                <label className="">{subject}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="flex justify-center items-center gap-4 mt-5">
                            <button type="submit" onClick={() => handleClearFilter()} className="bg-gray-500 text-white font-semibold px-8 py-2  rounded hover:bg-gray-600 transition ">
                                Clear
                            </button>
                            <button type="submit" onClick={() => handleAddFilters()} className="bg-purple-500 text-white font-semibold px-8 py-2  rounded hover:bg-purple-600 transition ">
                                Filter
                            </button>
                        </div>

                    </div>
                }
            </div>


        </>
    )
}
export default TeacherViewTasks