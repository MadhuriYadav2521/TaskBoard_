import axios from 'axios';
import React, { useEffect, useState } from 'react'

const TeacherSubmissions = () => {

    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    console.log(userData, "userData");

    const [taskData, setTaskData] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [selectedStudent, setselectedStudent] = useState(null)
    const [showStatusModel, setShowStatusModel] = useState(false)

    const getTaskData = async () => {
        try {
            const data = {
                teacherId: userData?._id
            }
            const response = await axios.post('http://localhost:8000/fetchSubmissionsByTeacher', data)
            if (response.data.success == true) {
                setTaskData(response.data.data)
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
    console.log(taskData, "wwwww");

    const handleCheckClick = (task) => {
        setSelectedTask(task)
    }
    console.log(selectedTask, "selectedTask");

    const handleAddMarking = (student) => {
        setShowStatusModel(true)
        setselectedStudent(student)
    }

    const closeStatusModel = () => {
        setShowStatusModel(false)
        setselectedStudent(null)
    }



    return (
        <>
            <div className="w-full  bg-white p-4 overflow-x-auto relative ">
                {!selectedTask ? (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-2xl font-semibold">Tasks</p>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto ">
                            <table className="min-w-full border-2 border-gray-300 p-3">
                                <thead className="sticky top-0 z-10 w-full">
                                    <tr className="border-2 border-gray-300 p-3 bg-purple-300">
                                        <th className="border-2 border-gray-300 p-3">SR.No.</th>
                                        <th className="border-2 border-gray-300 p-3">Title</th>
                                        <th className="border-2 border-gray-300 p-3">Subject</th>
                                        <th className="border-2 border-gray-300 p-3">Grade</th>
                                        <th className="border-2 border-gray-300 p-3">Created At</th>
                                        <th className="border-2 border-gray-300 p-3">Deadline</th>
                                        <th className="border-2 border-gray-300 p-3">Submissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taskData?.map((t, i) => (
                                        <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer">
                                            <td className="border-2 border-gray-300 p-3">{i + 1}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.taskTitle}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.subject}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.grade}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.deadlineDate).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3">
                                                <button
                                                    className='outline-none bg-purple-200 py-2 px-4 cursor-pointer hover:bg-purple-400'
                                                    onClick={() => handleCheckClick(t)}
                                                >Check</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-2xl font-semibold">Tasks: {selectedTask.taskTitle}</p>
                            <button type="submit" className="bg-purple-500 text-white font-semibold px-8 py-2  rounded hover:bg-purple-600 transition" onClick={() => setSelectedTask(null)}>
                                Back
                            </button>
                        </div>

                        <div>
                            <div className="max-h-[400px] overflow-y-auto ">
                                <table className="min-w-full border-2 border-gray-300 p-3">
                                    <thead className="sticky top-0 z-10 w-full">
                                        <tr className="border-2 border-gray-300 p-3 bg-purple-300">
                                            <th className="border-2 border-gray-300 p-3">Title</th>
                                            <th className="border-2 border-gray-300 p-3">Subject</th>
                                            <th className="border-2 border-gray-300 p-3">Description</th>
                                            <th className="border-2 border-gray-300 p-3">Grade</th>
                                            <th className="border-2 border-gray-300 p-3">Created At</th>
                                            <th className="border-2 border-gray-300 p-3">Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer">
                                            <td className="border-2 border-gray-300 p-3">{selectedTask.taskTitle}</td>
                                            <td className="border-2 border-gray-300 p-3">{selectedTask.subject}</td>
                                            <td className="border-2 border-gray-300 p-3">{selectedTask.discription}</td>
                                            <td className="border-2 border-gray-300 p-3">{selectedTask.grade}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(selectedTask.createdAt).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(selectedTask.deadlineDate).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>



                            <div className='text-[18px] font-extrabold mt-3 mb-3'>Assigned To: </div>



                            <div className="max-h-[400px] overflow-y-auto ">
                                <table className="min-w-full border-2 border-gray-300 p-3">
                                    <thead className="sticky top-0 z-10 w-full">
                                        <tr className="border-2 border-gray-300 p-3 bg-purple-300">
                                            <th className="border-2 border-gray-300 p-3">SR.No.</th>
                                            <th className="border-2 border-gray-300 p-3">Name</th>
                                            <th className="border-2 border-gray-300 p-3">Email</th>
                                            <th className="border-2 border-gray-300 p-3">Submission File</th>
                                            <th className="border-2 border-gray-300 p-3">Submitted At</th>
                                            <th className="border-2 border-gray-300 p-3">Status</th>
                                            <th className="border-2 border-gray-300 p-3">Mark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTask?.submissions?.map((t, i) => (
                                            <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer">
                                                <td className="border-2 border-gray-300 p-3">{i + 1}</td>
                                                <td className="border-2 border-gray-300 p-3">{t.studentName}</td>
                                                <td className="border-2 border-gray-300 p-3">{t.studentEmail}</td>
                                                <td className="border-2 border-gray-300 p-3">{t.submissionFile}</td>
                                                <td className="border-2 border-gray-300 p-3">{t.submittedAt !== null && new Date(t.submittedAt).toLocaleDateString()}</td>
                                                <td className="border-2 border-gray-300 p-3">{t.status}</td>
                                                <td className="border-2 border-gray-300 p-3">
                                                    <button
                                                        className='outline-none bg-cyan-200 py-2 px-4 cursor-pointer hover:bg-cyan-600 text-nowrap'
                                                        onClick={() => handleAddMarking(t)}
                                                    >Add Mark</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {selectedStudent &&
                    <div className='absolute top-1/4 left-2/4 border-2 border-gray-400 bg-white z-40 w-[40%] p-3'>
                        <div className="flex justify-end items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => closeStatusModel()} className='cursor-pointer text-red-600' width="18" height="18" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </div>
                        <div className='text-center flex justify-center items-center flex-col'>
                            <p className='text-[18px] font-bold mb-4'>Review Submission for {selectedStudent.studentName}</p>
                            <div>
                                <button className='capitalize outline-none cursor-pointer py-2 px-4 bg-green-500 hover:bg-green-700 text-white tex-[16px] mr-7 mb-4'>accept</button>
                                <button className='capitalize outline-none cursor-pointer py-2 px-4 bg-red-500 hover:bg-red-700 text-white tex-[16px]'>reject</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default TeacherSubmissions