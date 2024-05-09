import { useState, useEffect, createContext } from "react";
import { io } from "socket.io-client";

const AuthContext = createContext();

let socket = "";

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  const verifyToken = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const user = await response.json();
          socket = io(`${import.meta.env.VITE_API_URL}`);
          setIsLoggedIn(true);
          setUser(user);
        } else {
          throw new Error("Failed to verify token");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        removeToken();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      // Attempt to reconnect manually or let Socket.io handle it automatically
      socket.connect();
    };

    const handleError = (error) => {
      console.error("Socket connection error:", error);
      // Handle connection error, if needed
    };

    if (isLoggedIn) {
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleError);
    }

    return () => {
      if (isLoggedIn) {
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleError);
      }
    };
  }, [isLoggedIn, socket]);

  const onMount = async () => {
    await verifyToken();
  };

  useEffect(() => {
    onMount();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        logOutUser,
        verifyToken,
        socket,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
