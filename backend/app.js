import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/userRoute.js'
import Chats from './models/chatModel.js'
import chatRouter from './routes/chatRoute.js'
import path from "path";
import { fileURLToPath } from 'url';
import taskRouter from './routes/taskRoute.js'
import studentRoute from './routes/studentRoute.js'
dotenv.config();

const app = express()

// ------------- maintain app.use sequence -------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // ⬅️ This is necessary for non-multipart JSON routes
app.use(morgan('dev'));

app.use(userRouter)
app.use(chatRouter)
app.use(taskRouter)
app.use(studentRoute)

// ✅ Make uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST']
    }
});

const users = new Map(); // socketId <-> userId
const activeChats = new Map(); // userId -> currently selected chat userId

mongoose.connect(process.env.CONNECTION)
    .then(() => console.log("✅ DB Connected"))
    .catch((e) => console.log("❌Erro in db connection", e))



io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Save user with their socket id
    socket.on('add-user', (userId) => {
        users.set(userId, socket.id);
    });

    socket.on('chatting-with', ({ userId, chattingWith }) => {
        console.log(userId, chattingWith,"xxxxxxxxxxxxxxxxxxxxx");
        
        activeChats.set(userId, chattingWith);
    });

    // Handle personal message
    // server.js or wherever socket is setup
    socket.on('send-msg', async ({ from, to, message }) => {
         const isReceiverActive = activeChats.get(to) === from;
         console.log(isReceiverActive,"isReceiverActive");
         
        // Save chat to DB
        const chat = await Chats.create({ 
            senderId: from, 
            receiverId: to, 
            message,
            read: isReceiverActive ? true : false, // ✅ mark as read only if chatting
         });

        // Send real-time message to recipient
        const toSocketId = users.get(to);
        if (toSocketId) {
            io.to(toSocketId).emit('msg-receive', {
                from,
                message,
                createdAt: chat.createdAt,
            });
            io.to(toSocketId).emit('update-recent-chats', { userId: to });
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // for (let [key, value] of users.entries()) {
        //     if (value === socket.id) users.delete(key);
        // }

        for (let [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                activeChats.delete(userId);
                break;
            }
        }
    });
});


const port = process.env.PORT || 4000
server.listen(port, () => console.log("🚀 Running on port", port))