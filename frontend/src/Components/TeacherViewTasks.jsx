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
                                    <td className="text-ellipsis border-2 border-gray-300 p-3">
                                       <a href={`https://docs.google.com/viewer?url=${t.taskFileName}&embedded=true`} target="_blank" className="cursor-pointer bg-purple-200 text-nowrap px-3 py-2 hover:bg-purple-500">Open File</a>
                                    </td>
                                    <td className="border-2 border-gray-300 p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="border-2 border-gray-300 p-3">{new Date(t.deadlineDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Filters Modal */}
                {showFilters && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                        <div className="bg-white w-full sm:w-[90%] md:w-[70%] lg:w-[60%] max-h-[90vh] overflow-y-auto p-6 rounded shadow-xl relative">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Filter By</h2>
                                <button onClick={() => setShowFilters(false)} className="text-red-600 text-[26px] font-bold">
                                    &times;
                                </button>
                            </div>

                            {/* Filter Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="font-medium block">Title:</label>
                                        <input
                                            type="text"
                                            name="taskTitle"
                                            className="w-full border-2 focus:border-purple-400 outline-none rounded px-3 py-2"
                                            onChange={handleChange}
                                            value={filters.taskTitle}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium block">Description:</label>
                                        <input
                                            type="text"
                                            name="discription"
                                            className="w-full border-2 focus:border-purple-400 outline-none rounded px-3 py-2"
                                            onChange={handleChange}
                                            value={filters.discription}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium block">Created Date:</label>
                                        <input
                                            type="date"
                                            name="createdAt"
                                            className="w-full border-2 focus:border-purple-400 outline-none rounded px-3 py-2"
                                            onChange={handleChange}
                                            value={filters.createdAt}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium block">Deadline Date:</label>
                                        <input
                                            type="date"
                                            name="deadlineDate"
                                            className="w-full border-2 focus:border-purple-400 outline-none rounded px-3 py-2"
                                            onChange={handleChange}
                                            value={filters.deadlineDate}
                                        />
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="font-medium block">Select Grade:</label>
                                        <select
                                            className="w-full border-2 focus:border-purple-400 outline-none rounded px-3 py-2"
                                            name="grade"
                                            onChange={handleChange}
                                            value={filters.grade}
                                        >
                                            <option value="">Select grade</option>
                                            {grades.map((g, index) => (
                                                <option key={index} value={g.value}>
                                                    {g.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-medium block mb-2">Subjects:</label>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                            {userData?.subjects?.map((subject, index) => (
                                                <div key={index} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name={subject}
                                                        value={subject}
                                                        className="mr-2 accent-purple-600"
                                                        onChange={handleChange}
                                                        checked={filters.subject.includes(subject)}
                                                    />
                                                    <label>{subject}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={handleClearFilter}
                                    className="bg-gray-500 text-white font-medium px-6 py-2 rounded hover:bg-gray-600"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleAddFilters}
                                    className="bg-purple-500 text-white font-medium px-6 py-2 rounded hover:bg-purple-600"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </>
    )
}
export default TeacherViewTasks