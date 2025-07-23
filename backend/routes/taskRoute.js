import express from 'express'
import { addTask, fetchSubmissionsByTeacher, getAllTask } from '../controllers/teacherController.js';
import fileUploadMiddleware from '../middlewares/fileUploadMiddleware.js';


const taskRouter  = express.Router()

taskRouter.post('/addTask',fileUploadMiddleware, addTask)
taskRouter.post('/getAllTasks',getAllTask)
taskRouter.post('/fetchSubmissionsByTeacher',fetchSubmissionsByTeacher)



export default taskRouter;

