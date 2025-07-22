import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setCount } from '../Redux/chatSlice';

const socket = io('http://localhost:8000'); // adjust to your server

const Chat = () => {
    const dispatch = useDispatch()
    const { unreadChatCount } = useSelector((s) => s.chatReducer)
    console.log(unreadChatCount, "unreadChatCount");
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [selectedChat, setSelectedChat] = useState(false);
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    const [isUsersLoaded, setIsUsersLoaded] = useState(false);
    const chatEndRef = React.useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    const selectChat = (chat) => {
        setSelectedChat(true)
        setSelectedUser(chat)
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.post('http://localhost:8000/fetchUsers')
            if (response?.data?.status == 200) {
                const teacherList = response.data.users.filter((f) => f._id !== userData._id)
                const currentUser = response.data.users.find((f) => f._id === userData._id)
                setAllUsers(teacherList)
                setCurrentUser(currentUser)
                setIsUsersLoaded(true);
            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        socket.emit('add-user', currentUser?._id);

        socket.on('msg-receive', (data) => {
            console.log("sending....................");

            // Only add message if it's from selectedUser
            if (selectedUser._id === data.from) {
                setChat((prev) => [...prev, { fromSelf: false, text: data.message, createdAt: data.createdAt }]);
            }
        });

        return () => socket.off('msg-receive');

    }, [currentUser?._id, selectedUser?._id]);

    useEffect(() => {
        socket.on('update-recent-chats', (data) => {
            if (data.userId === currentUser._id) {
                fetchRecentChats();
            }
        });

        return () => socket.off('update-recent-chats');
    }, [currentUser?._id]);

    const handleSend = () => {
        if (!message) return;
        socket.emit('send-msg', {
            from: currentUser?._id,
            to: selectedUser?._id,
            message,
        });
        setChat((prev) => [...prev, { fromSelf: true, text: message, createdAt: new Date().toISOString(), }]);
        setMessage('');
    };

    useEffect(() => {
        if (selectedUser?._id && currentUser?._id) {
            socket.emit('chatting-with', {
                userId: currentUser._id,
                chattingWith: selectedUser._id,
            });
        }
    }, [selectedUser?._id]);

    const fetchMessages = async () => {
        try {
            const data = {
                senderId: currentUser?._id,
                receiverId: selectedUser?._id
            }
            const response = await axios.post('http://localhost:8000/getChat', data)
            if (response?.data?.status == 200) {
                const mappedMessages = response.data.messages.map((msg) => ({
                    text: msg.message,
                    fromSelf: msg.senderId == currentUser._id,
                    createdAt: msg.createdAt,
                }));
                setChat(mappedMessages);

            } else {
                alert("Error in fetch chats.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }
    useEffect(() => {
        const fetchChatAndRefresh = async () => {
            if (selectedChat === true) {
                await fetchMessages();
                await fetchRecentChats();
            }
        };

        fetchChatAndRefresh();
    }, [selectedUser?._id])

    const fetchRecentChats = async () => {
        try {
            const res = await axios.post("http://localhost:8000/getRecentChats", { userId: userData._id });
            const recent = res?.data?.chats;

            // 🛡️ Skip if data isn't ready
            if (!recent || allUsers.length === 0) return;

            const usersWithUnread = allUsers.map(user => {
                const chatData = recent.find(r => r._id === user._id);
                return {
                    ...user,
                    unread: chatData?.unreadCount || 0,
                    lastTime: chatData?.lastTime || null
                };
            });

            // 📊 Sort by recent chat time
            const sorted = usersWithUnread.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
            setAllUsers(sorted)
            const totalUnreadCount = sorted.reduce((total, user) => {
                return total + (user.unread || 0);
            }, 0);
            console.log(totalUnreadCount, "qqqqqqqqq");
            dispatch(setCount({
                unreadCount: totalUnreadCount
            }))
            setIsUsersLoaded(false)


        } catch (error) {
            console.log("Error in fetch recent chats", error);
        }
    };


    useEffect(() => {
        if (isUsersLoaded) {
            fetchRecentChats();
        }
    }, [isUsersLoaded]);


    useEffect(() => {
        socket.on('update-recent-chats', (data) => {
            if (data.userId === currentUser._id) {
                fetchRecentChats();
            }
        });

        return () => socket.off('update-recent-chats');
    }, [userData._id]);

    const handleBackFromChats = () => {
        socket.emit('chatting-with', {
            userId: currentUser._id,
            chattingWith: null,
        });
        setSelectedChat(false)
        setSelectedUser({})
        fetchUsers()
        fetchRecentChats();
    }

    console.log(selectedUser, "selectedUser");
    console.log(selectedChat, "selectedChat");
    console.log(allUsers, "allUsersbbbbb");


    return (
        <>
            {selectedChat == false &&
                <div className="">
                    <h2 className="text-lg font-semibold mb-2">All Chats</h2>
                    <div className="space-y-4 h-[460px] overflow-y-auto">
                        {allUsers?.map((u) => (
                            <div key={u._id} onClick={() => selectChat(u)} className="flex justify-between items-center bg-white shadow-md p-3 rounded cursor-pointer hover:bg-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer border-2 border-gray-600 overflow-hidden ">
                                            <img src={u?.profileImg ? `http://localhost:8000/uploads/${u?.profileImg}` : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'} className="object-cover w-10 h-10 rounded-full" alt="" />
                                        </div>

                                    </div>
                                    <p>{`${u.fName} ${u.lName}`}</p>
                                </div>
                                <div className='flex justify-between items-end gap-2'>
                                    {u.unread > 0 && (
                                        <span className=" bg-purple-400 text-black shadow-2xl text-xs px-1.5 rounded-full">
                                            {u.unread}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => selectChat(u)}
                                        className="text-purple-600 hover:text-purple-800"
                                    >
                                        💬
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            }

            {selectedChat == true &&
                <div className='h-[500px] overflow-y-auto'>

                    <div className="h-[100%] flex flex-col">
                        <div className="flex items-center space-x-4 mb-4 justify-between">
                            <div className='flex items-center gap-3 '>
                                <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-gray-600 overflow-hidden  ">
                                    <img src={selectedUser?.profileImg ? `http://localhost:8000/uploads/${selectedUser?.profileImg}` : 'https://cdn-icons-png.flaticon.com/512/7915/7915522.png'} className="object-cover w-10 h-10 rounded-full" alt="" />
                                </div>

                                <h2 className="text-lg font-semibold">{`${selectedUser.fName} ${selectedUser.lName}`}</h2>
                            </div>


                            <div onClick={() => handleBackFromChats()} className="my-2 mx-2 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded shadow-inner  overflow-y-auto flex flex-col space-y-2">
                            {chat.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`self-start px-3 py-1 rounded-lg text-sm shadow w-fit max-w-[90%] break-words whitespace-pre-wrap 
                                    ${msg.fromSelf ? 'bg-purple-200 self-end text-right' : 'bg-purple-400 text-left'}`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="block text-[10px] text-gray-600 ">
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        <div className="mt-4 flex">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 border rounded-l px-4 py-2 outline-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend();
                                    }
                                }}
                            />
                            <button onClick={() => handleSend()} className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Chat;
