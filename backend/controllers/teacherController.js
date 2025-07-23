import Tasks from "../models/taskModel.js";
import TaskSubmissions from "../models/taskSubmissionModel.js";
import Users from "../models/userModel.js";
import mongoose from "mongoose";


export const addTask = async (req, res) => {
    try {
        const { taskTitle, discription, grade, subject, createdBy, deadlineDate } = req.body
        console.log(req.body,"req.body");
        
        if (!taskTitle || !discription || !grade || !subject || !createdBy || !deadlineDate) return res.status(400).json({ status: 400, message: "All fields are required." })

        const taskFile = req?.files?.taskFileName?.[0]
        console.log(taskFile, "taskFile");

        const taskFileName = taskFile ? taskFile?.filename : ""
        console.log(taskFileName, "taskFileName");

        const newTask = new Tasks({
            taskTitle, discription, grade, subject, taskFileName, createdBy, deadlineDate
        })
        await newTask.save()

        const fetchStudents = await Users.find({grade : grade, subjects: {$in: subject}}).exec();
        console.log(fetchStudents,"fetchStudents");

        const assignedToList = fetchStudents.map(s =>({
            studentId: s._id,
            submittedAt: null,
            submissionFile: "",
            status: "Pending",
            isOpened: false
        }))

        const addToSubmissionTable = new TaskSubmissions({
            taskId: newTask._id,
            createdBy: createdBy,
            assignedTo: assignedToList
        })

        await addToSubmissionTable.save()
        

        return res.status(200).json({ status: 200, message: "Task created.", newTask, assignedToList, addToSubmissionTable })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Internal server error." })

    }
}


export const getAllTask = async (req, res) => {
    try {
        const {
            userId,
            taskTitle,
            discription,
            grade,
            subject,
            createdAt,
            deadlineDate
        } = req.body;
        console.log( req.body,"xxxxxx");
        

        if (!userId)
            return res.status(400).json({ status: 400, message: "User id required.", success: false });

        const query = { createdBy: userId };

        // Dynamically add filters if they are provided and not empty
        if (taskTitle) query.taskTitle = { $regex: taskTitle, $options: 'i' };
        if (discription) query.discription = { $regex: discription, $options: 'i' };
        if (grade) query.grade = grade;

        if (subject) {
            if (Array.isArray(subject) && subject.length > 0) {
                query.subject = { $in: subject };
            }
        }

        if (createdAt) query.createdAt = { $gte: new Date(createdAt) };
        if (deadlineDate) query.deadlineDate = { $lte: new Date(deadlineDate) };

        console.log(query,"query");
        
        const tasks = await Tasks.find(query).sort({ createdAt: -1 });

        if (!tasks || tasks.length === 0) return res.status(200).json({ status: 200,  success: false, message: "No matching filter tasks found.", });

        return res.status(200).json({ status: 200, message: "Tasks fetched.", tasks, success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    }
};


export const fetchSubmissionsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;

    const result = await TaskSubmissions.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(teacherId)
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
      { $unwind: "$assignedTo" },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo.studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $match: {
          "student.role": "student"
        }
      },
      {
        $project: {
          taskId: 1,
          taskTitle: "$taskDetails.taskTitle",
          discription: "$taskDetails.discription",  
          createdAt: "$taskDetails.createdAt",  
          deadlineDate: "$taskDetails.deadlineDate",
          grade: "$taskDetails.grade",
          subject: "$taskDetails.subject",
          taskFileName: "$taskDetails.taskFileName",
          studentName: { $concat: ["$student.fName", " ", "$student.lName"] },
          studentEmail: "$student.email",
          studentProfileImg: "$student.profileImg",
          submissionFile: "$assignedTo.submissionFile",
          submittedAt: "$assignedTo.submittedAt",
          status: "$assignedTo.status",
          isOpened: "$assignedTo.isOpened"
        }
      },
      {
        $group: {
          _id: "$taskId",
          taskTitle: { $first: "$taskTitle" },
          discription: { $first: "$discription" },
          createdAt: { $first: "$createdAt" },
          deadlineDate: { $first: "$deadlineDate" },
          grade: { $first: "$grade" },
          subject: { $first: "$subject" },
          taskFileName: { $first: "$taskFileName" },
          submissions: {
            $push: {
              studentName: "$studentName",
              studentEmail: "$studentEmail",
              studentProfileImg: "$studentProfileImg",
              submissionFile: "$submissionFile",
              submittedAt: "$submittedAt",
              status: "$status",
              isOpened: "$isOpened"
            }
          }
        }
      }
    ]);

    return res.status(200).json({
      status: 200,
      message: "Fetched all task submissions with task details",
      data: result,
      success: true
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false
    });
  }
};




