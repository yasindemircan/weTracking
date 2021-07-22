import React, { useState, createContext, useEffect } from "react";
import socket from "../helpers/Socket";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
    const [activityNumberStore, setActivityNumberStore] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("users", (user) => {
            setUsers(user);
        });
    }, [socket]);

    return (
        <UsersContext.Provider
            value={{ users, setUsers, activityNumberStore, setActivityNumberStore }}
        >
            {children}
        </UsersContext.Provider>
    );
};

export { UsersContext, UsersProvider };
