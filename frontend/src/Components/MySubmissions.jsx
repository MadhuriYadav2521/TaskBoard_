import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const MySubmissions = () => {
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    console.log(userData, "userData");
    const [taskData, setTaskData] = useState([])

    const getTaskData = async () => {
        try {
            const data = {
                studentId: userData?._id
            }
            const response = await axios.post('http://localhost:8000/fetchTaskByStudentId', data)
            if (response.data.success == true) {
                setTaskData(response.data.completedTasks)
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
    return (
        <>
            <div className='w-full  bg-white p-4 overflow-x-auto relative '>
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
                                <th className="border-2 border-gray-300 p-3">Submission File</th>
                                <th className="border-2 border-gray-300 p-3">Created At</th>
                                <th className="border-2 border-gray-300 p-3">Deadline</th>
                                <th className="border-2 border-gray-300 p-3">Submitted At</th>
                                <th className="border-2 border-gray-300 p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskData?.length > 0 ? (
                                <>
                                    {taskData?.map((t, i) => (
                                        <tr className="border-2 border-gray-300 p-3 hover:bg-gray-200  cursor-pointer">
                                            <td className="border-2 border-gray-300 p-3">{i + 1}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.taskDetails.taskTitle}</td>
                                            <td className="border-2 border-gray-300 p-3">{t.taskDetails.subject}</td>
                                            <td className="text-ellipsis border-2 border-gray-300 p-3">{t.assignedTo[0].submissionFile}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.taskDetails.createdAt).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3">{new Date(t.taskDetails.deadlineDate).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3 ">{new Date(t.assignedTo[0].submittedAt).toLocaleDateString()}</td>
                                            <td className="border-2 border-gray-300 p-3 text-green-600">{t.assignedTo[0].status}</td>
                                        </tr>
                                    ))}
                                </>
                            )
                                : (
                                    <tr>
                                        <td className='text-center mt-4'>No Submissions yet.</td>
                                    </tr>
                                )}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MySubmissions