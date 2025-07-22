import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import axios from 'axios';

const MyTasks = () => {
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    console.log(userData, "userData");
    const [taskData, setTaskData] = useState([])
    const [showDetailedTask, setShowDetailedTask] = useState(false)
    const [filters, setFilters] = useState({
        userId: userData?._id, taskTitle: "", subject: "", deadlineDate: ""
    })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedTask, setSelectedTasks] = useState(null)
    console.log(selectedTask, "selectedTask");
    const fileRef = useRef()
    const [submissionFile, setSubmissionFile] = useState("")

    const getTaskData = async () => {
        try {
            const data = {
                studentId: userData?._id,
                taskStatus: "Pending"
            }
            const response = await axios.post('http://localhost:8000/fetchTaskByStudentId', data)
            if (response.data.success == true) {
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


    const handleChange = (e) => {
        setSubmissionFile(e.target.files[0])
    }
    console.log(submissionFile, "submissionFile");

    const handleShowDetailedTask = (taskData) => {
        setShowDetailedTask(true)
        setSelectedTasks(taskData)
    }

    const handleSubmit = async () => {
        try {
            if(submissionFile == ""){
                alert("Please select file.")
                return
            }
            const formData = new FormData()
            formData.append("studentId",userData?._id);
            formData.append("taskId",selectedTask?.taskId);
            formData.append("submissionFile",submissionFile);

            const response = await axios.post('http://localhost:8000/submitTask', formData)
            console.log(response.data, "vvvvvvvvv");

            if (response.data.success == true) {
                alert(response.data.message)
                setShowDetailedTask(false)
                getTaskData()
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }



    return (
        <>
            <div className="w-full  bg-white p-4 overflow-x-auto relative ">
                {showDetailedTask ? (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-2xl font-semibold">Task Details</p>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { setShowDetailedTask(false), setSelectedTasks(null) }} className='cursor-pointer text-red-600' width="18" height="18" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </div>
                        <div className="max-w-3xl mx-auto mt-8 max-h-[400px] overflow-y-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                <tbody>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700 w-1/3">Title</td>
                                        <td className="px-4 py-3 text-gray-800">{selectedTask.taskDetails.taskTitle}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Description</td>
                                        <td className="px-4 py-3 text-gray-800">{selectedTask.taskDetails.discription}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Subject</td>
                                        <td className="px-4 py-3 text-gray-800">{selectedTask.taskDetails.subject}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Created By</td>
                                        <td className="px-4 py-3 text-gray-800">{selectedTask.createdByUser.fName} {selectedTask.createdByUser.lName} <small>({selectedTask.createdByUser.email})</small> </td>
                                    </tr>
                                    <tr className='border-2 border-gray-200'>
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Created At</td>
                                        <td className="px-4 py-3 text-gray-800">{new Date(selectedTask.taskDetails.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Task File</td>
                                        <td className="px-4 py-3 text-gray-800">{selectedTask.taskDetails.taskFileName}</td>
                                    </tr>
                                    <tr className='border-2 border-gray-200'>
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Deadline</td>
                                        <td className="px-4 py-3 text-gray-800 font-semibold">{new Date(selectedTask.taskDetails.deadlineDate).toLocaleDateString()}</td>
                                    </tr>
                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Status</td>
                                        <td className="px-4 py-3 text-red-500">{selectedTask.assignedTo[0].status}</td>
                                    </tr>

                                    <tr className="border-2 border-gray-200">
                                        <td className="px-4 border-2 py-3 font-semibold text-gray-700">Submit Here</td>
                                        <td className="px-4 py-3 ">
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                name="taskFileName"
                                                className="block w-full cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded 
                                            file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                                                onChange={handleChange}
                                            />
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="bg-purple-500 mt-4 text-white font-semibold px-8 py-2 rounded hover:bg-purple-600 transition">
                                                Submit
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                    </>
                ) : (
                    <>

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
                                        <th className="border-2 border-gray-300 p-3">Subject</th>
                                        <th className="border-2 border-gray-300 p-3">File</th>
                                        <th className="border-2 border-gray-300 p-3">Created At</th>
                                        <th className="border-2 border-gray-300 p-3">Deadline</th>
                                        <th className="border-2 border-gray-300 p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taskData?.map((t, i) => (
                                        <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer" onClick={() => handleShowDetailedTask(t)}>
                                            <td className="border-2 border-gray-300 p-3">{i + 1}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.taskDetails.taskTitle}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.taskDetails.subject}</td>
                                            <td className="text-ellipsis border-2 border-gray-300 p-3">{t.taskDetails.taskFileName}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.taskDetails.createdAt).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.taskDetails.deadlineDate).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3 text-red-600">{t.assignedTo[0].status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

            </div>
        </>
    )
}

export default MyTasks