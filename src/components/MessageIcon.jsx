import { Indicator } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { PiChatCircleDotsBold } from "react-icons/pi";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const MessageIcon = () => {
  const { user, isLoggedIn, socket } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const location = useLocation();

  const getUnreadConversationsCount = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/unread-conversations/${
          user.userId
        }`
      );
      if (response.ok) {
        const responseData = await response.json();
        setCount(responseData);
      }
    } catch (error) {
      console.log(error, "on getting unread conversations count");
    }
  };

  useEffect(() => {
    if (location.pathname.includes("/direct/t")) {
      setTimeout(() => {
        getUnreadConversationsCount();
      }, 500);
    }
  }, [location.pathname]);

  const handleDisconnect = () => {
    socket.emit("join_messages", user.userId);
  };

  useEffect(() => {
    if (isLoggedIn && socket) {
      socket.emit("join_messages", user.userId);

      socket.on("unread_conversations", (conversationId) => {
        console.log("Unread conversations message icon");
        setTimeout(() => {
          getUnreadConversationsCount();
        }, 500);
      });
      socket.on("disconnect", handleDisconnect);

      getUnreadConversationsCount();
    }
    return () => {
      socket.off("unread_conversations");
      socket.off("disconnect", handleDisconnect);
    };
  }, [isLoggedIn]);

  return (
    <Indicator
      styles={{ indicator: { top: "5px", right: "5px" } }}
      withBorder
      inline
      color="red"
      label={count}
      disabled={count ? false : true}
      size={25}
      onClick={() => navigate("/direct/inbox")}
    >
      <PiChatCircleDotsBold size={30} />
    </Indicator>
  );
};

export default MessageIcon;
