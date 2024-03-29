import { ReactNode, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { baseURL } from "../api/api";
import { setTokenUpdateCallback } from "../helpers/tokenManager";
import { socketContext } from "../hooks/context/useSocketContext";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [token, setToken] = useState(localStorage.getItem("ID_TOKEN"));
    useEffect(() => {
        console.log("making connection");
        const socketInstance = io(`${baseURL}`, { query: { authorization: `Bearer ${token}` } });
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [token]);

    useEffect(() => {
        setTokenUpdateCallback((newToken) => {
            console.log("newToken");
            setToken(newToken);
        });
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "ID_TOKEN") {
                const updatedToken = event.newValue;
                setToken(updatedToken);
            }
        };
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>;
};

export default SocketContextProvider;
