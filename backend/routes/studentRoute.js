import express from "express"
import { fetchNewTask, fetchTaskByStudentId, markAsReadTask, submitTask } from "../controllers/studentController.js";
import fileUploadMiddleware from "../middlewares/fileUploadMiddleware.js";

const studentRoute = express.Router()


studentRoute.post('/fetchTaskByStudentId',fetchTaskByStudentId)
studentRoute.post('/fetchNewTask',fetchNewTask)
studentRoute.post('/markAsReadTask',markAsReadTask)
studentRoute.post('/submitTask',fileUploadMiddleware,submitTask)

export default studentRoute;