import TaskSubmissions from "../models/taskSubmissionModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";
import Tasks from "../models/taskModel.js";


export const fetchTaskByStudentId = async (req, res) => {
    try {
        const { studentId, taskStatus } = req.body;
        console.log(req.body, "jjj");
        const tasks = await TaskSubmissions.aggregate([
            {
                $match: {
                    "assignedTo.studentId": new mongoose.Types.ObjectId(studentId)
                }
            },
            {
                $addFields: {
                    assignedTo: {
                        $filter: {
                            input: "$assignedTo",
                            as: "item",
                            cond: {
                                $and: [
                                    { $eq: ["$$item.studentId", new mongoose.Types.ObjectId(studentId)] },
                                    { $eq: ["$$item.status", taskStatus] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    assignedTo: { $ne: [] } // Only keep tasks where the student has a pending entry
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "taskId",
                    foreignField: "_id",
                    as: "taskDetails"
                }
            },
            { $unwind: "$taskDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByUser"
                }
            },
            { $unwind: "$createdByUser" }
        ]);

        return res.status(200).json({
            status: 200,
            message: "Student-specific tasks fetched",
            tasks,
            success: true
        });

    } catch (error) {
        console.log("Error in fetchTaskByStudentId:", error);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};


export const fetchNewTask = async (req, res) => {
    try {
        const { studentId } = req.body;

        // Step 1: Get tasks with this student and isOpened = false
        const allTasks = await TaskSubmissions.find({
            assignedTo: {
                $elemMatch: {
                    studentId,
                    isOpened: false,
                },
            },
        })
            .populate("taskId")
            .populate("createdBy");

        // Step 2: Filter only the relevant assignedTo entry per task
        const studentTasks = allTasks.map(task => {
            const filteredAssignedTo = task.assignedTo.filter(
                assign => assign.studentId.toString() === studentId && assign.isOpened === false
            );

            return {
                ...task.toObject(),
                assignedTo: filteredAssignedTo,
            };
        });

        return res.status(200).json({
            status: 200,
            message: "Student-specific tasks fetched",
            tasks: studentTasks,
            success: true,
        });
    } catch (error) {
        console.error("Error in fetch task:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    }
};


export const markAsReadTask = async (req, res) => {
    try {
        const { studentId, taskId } = req.body
        console.log(req.body, "bbbbbbb");

        const updateTask = await TaskSubmissions.findOneAndUpdate(
            {
                taskId: taskId,
                "assignedTo.studentId": studentId
            }, {
            $set: {
                "assignedTo.$.isOpened": true
            }
        }, { new: true }).exec()

        return res.status(200).json({ status: 200, message: "Task marked as read.", success: true })

    } catch (error) {
        console.error("Error in fetch task:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    }
}

export const submitTask = async (req, res) => {
    try {
        const { studentId, taskId } = req.body
        console.log(req.body, "gggggg");

        const taskFile = req?.files?.submissionFile?.[0]
        console.log(taskFile, "taskFile");

        const submissionFile = taskFile ? taskFile?.filename : ""
        console.log(submissionFile, "submissionFile");

        const submitTaskFile = await TaskSubmissions.findOneAndUpdate(
            {
                taskId: taskId,
                "assignedTo.studentId": studentId
            },
            {
                $set: {
                    "assignedTo.$.submissionFile": submissionFile,
                    "assignedTo.$.submittedAt": Date.now(),
                    "assignedTo.$.status" : "Complete"
                }
            },
            { new: true }).exec()

        if(!submitTaskFile) return res.status(200).json({ status: 200, message: "Error in task submission.", success: false })

        return res.status(200).json({ status: 200, message: "Task submitted successfully.", success: true })


    } catch (error) {
        console.error("Error in fetch task:", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    }
}

