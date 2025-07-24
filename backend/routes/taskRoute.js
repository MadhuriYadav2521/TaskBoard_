import express from 'express'
import { addMark, addTask, fetchSubmissionsByTeacher, getAllTask } from '../controllers/teacherController.js';
import fileUploadMiddleware from '../middlewares/fileUploadMiddleware.js';


const taskRouter  = express.Router()

taskRouter.post('/addTask',fileUploadMiddleware, addTask)
taskRouter.post('/getAllTasks',getAllTask)
taskRouter.post('/fetchSubmissionsByTeacher',fetchSubmissionsByTeacher)
taskRouter.post('/addMark',addMark)




export default taskRouter;

