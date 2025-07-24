import Chats from "../models/chatModel.js";
import mongoose from "mongoose";

export const getChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body
        if (!senderId || !receiverId) return res.status(400).json({ status: 400, message: "SenderId and ReceiverId required.", success: false })

        await Chats.updateMany(
            { senderId: receiverId, receiverId: senderId, read: false },
            { $set: { read: true } }
        );
        const messages = await Chats.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({ status: 200, message: "Chats fetched successfully.", success: true, messages })

    } catch (error) {
        console.log("error in fetch chat:", error);
        return res.status(500).json({ status: 500, message: "internal server error." })

    }
}

export const getRecentChats = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            status: 400,
            message: "UserId is required.",
            success: false
        });
    }

    try {
        const objectUserId = new mongoose.Types.ObjectId(userId); // ✅ important fix

        const chats = await Chats.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: objectUserId },
                        { receiverId: objectUserId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    chatUserId: {
                        $cond: [
                            { $eq: ["$senderId", objectUserId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    isUnread: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$receiverId", objectUserId] },
                                    { $eq: ["$read", false] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$chatUserId",
                    lastMessage: { $first: "$message" },
                    lastTime: { $first: "$createdAt" },
                    unreadCount: { $sum: "$isUnread" }
                }
            },
            { $sort: { lastTime: -1 } }
        ]);

        return res.status(200).json({
            status: 200,
            chats
        });
    } catch (error) {
        console.error("Error fetching recent chats", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

