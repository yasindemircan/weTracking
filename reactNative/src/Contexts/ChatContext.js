import React, { useState, createContext, useEffect } from "react";
import socket from "../helpers/Socket";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [messageList, SetMessageList] = useState([]);
    const [lastKey, setlastKey] = useState(null);

    useEffect(() => {
        socket.on("SocketMsg", (data) => {
            SetMessageList((messageList) => [...messageList, data]);
        });
        return () => {
            console.log("disconnect runned");
            socket.disconnect();
        };
    }, [socket]);

    return (
        <ChatContext.Provider
            value={{ messageList, SetMessageList, lastKey, setlastKey }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };
