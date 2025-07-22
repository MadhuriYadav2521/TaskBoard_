import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const AddTask = () => {
    const [taskData, setTaskData] = useState({
        taskTitle: "",
        discription: "",
        grade: "",
        subject: "",
        taskFileName: "",
        createdBy: "",
        deadlineDate: ""
    })
    const fileRef = useRef(null)
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    const [subjects, setSubjects] = useState()
    const grades = [
        { name: 1, value: 1 },
        { name: 2, value: 2 },
        { name: 3, value: 3 },
        { name: 4, value: 4 },
        { name: 5, value: 5 },
    ]
    console.log(userData,"hgggg");
    

    const getCurrentUser = async () => {
        try {
            const data = { userId: userData?._id }
            const response = await axios.post('http://localhost:8000/currentUser', data)
            if (response.data.status == 200) {
                console.log(response.data.user, "nnnn");
                setSubjects(response?.data?.user?.subjects)
                setTaskData({ ...taskData, createdBy: response?.data?.user?._id })
            } else {
                alert("Error in fetching current user.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")

        }
    }
    useEffect(() => {
        getCurrentUser()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target

        if (type == "file") {
            setTaskData({ ...taskData, taskFileName: files[0] })
        } else {
            setTaskData({ ...taskData, [name]: value })
        }
    }
    console.log(taskData, "taskData");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            if (!taskData.taskTitle || !taskData.discription || !taskData.grade || !taskData.subject || !taskData.taskFileName || !taskData.deadlineDate) {
                return alert("All fields are required.")
            }
            const formData = new FormData()
            formData.append("taskTitle", taskData.taskTitle)
            formData.append("discription", taskData.discription)
            formData.append("grade", taskData.grade)
            formData.append("subject", taskData.subject)
            formData.append("taskFileName", taskData.taskFileName)
            formData.append("createdBy", userData._id)
            formData.append("deadlineDate", taskData.deadlineDate)
            console.log(formData, "formData");


            const response = await axios.post('http://localhost:8000/addTask', formData)
            console.log(response.data, "eeeeeeeeeeeeee");

            if (response.status == 200) {
                alert("Task added successfully.")
                setTaskData({
                    taskTitle: "",
                    discription: "",
                    grade: "",
                    subject: "",
                    taskFileName: "",
                    createdBy: "",
                    deadlineDate: ""
                })
                if(fileRef.current){
                    fileRef.current.value = null
                }
            } else {
                alert("Error in adding task.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")

        }
    }

    return (
        <>
            <div className=" flex items-center justify-center w-full">
                <form className=" w-full px-9 pt-3 bg-white shadow-md  ">
                    <h2 className="text-2xl font-bold text-center mb-8 mt-4 text-purple-700">Add Task</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700">Title:</label>
                                <input type="text" name="taskTitle" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={taskData.taskTitle} />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700">Description:</label>
                                <input type="text" name="discription" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={taskData.discription} />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700">Deadline Date:</label>
                                <input type="date" name="deadlineDate" className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" onChange={handleChange} value={taskData.deadlineDate} />
                            </div>

                        </div>

                        {/* Right Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700">Select Grade:</label>
                                <select className="w-full border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" name="grade" onChange={handleChange} value={taskData.grade}>
                                    <option value="" selected disabled>Select grade</option>
                                    {grades.map((g) => (
                                        <option value={g.value}>{g.name}</option>
                                    ))}

                                </select>

                            </div>
                            <div>
                                <label className="block font-medium text-gray-700">File:</label>
                                <input ref={fileRef} type="file" name="taskFileName" className="w-full cursor-pointer border border-purple-300 rounded px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Subjects:</label>
                                <div className="space-y-2">
                                    {subjects?.map((subject) => (
                                        <div key={subject} className="flex items-center">
                                            <input 
                                            type="radio" 
                                            name="subject" 
                                            value={subject} 
                                            className="mr-2 accent-purple-600 border-purple-400 rounded focus:ring-purple-300" 
                                            onChange={handleChange}
                                            checked={taskData?.subject == subject}
                                            />
                                            <label className="text-gray-700">{subject}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-8">
                        <button type="submit" onClick={handleSubmit} className="bg-purple-500 text-white font-semibold px-8 py-2 mb-10 rounded hover:bg-purple-600 transition">
                            ADD
                        </button>
                    </div>
                </form>
            </div>

        </>
    )
}
export default AddTask;