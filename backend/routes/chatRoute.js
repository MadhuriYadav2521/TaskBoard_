import express from 'express'
import { getChat, getRecentChats } from '../controllers/chatController.js';

const chatRouter  = express.Router()

chatRouter.post('/getChat', getChat)
chatRouter.post('/getRecentChats', getRecentChats)




export default chatRouter;

