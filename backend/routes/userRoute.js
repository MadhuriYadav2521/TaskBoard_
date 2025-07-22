import express from 'express'
import { currentUser, fetchALlUsers, fetchUsersByPagination, login, registerUser } from '../controllers/userController.js';
import fileUploadMiddleware from '../middlewares/fileUploadMiddleware.js';

const userRouter  = express.Router()

userRouter.post('/registerUser', fileUploadMiddleware, registerUser)
userRouter.post('/fetchUsers', fetchALlUsers)
userRouter.post('/login', login)
userRouter.post('/currentUser',currentUser)
userRouter.post('/fetchUsersByPagination',fetchUsersByPagination)




export default userRouter;

