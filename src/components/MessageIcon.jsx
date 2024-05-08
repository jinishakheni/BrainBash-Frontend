import { Indicator, Stack, UnstyledButton } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { PiChatCircleDotsBold } from "react-icons/pi";
import { io } from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const MessageIcon = () => {
  const { user, isLoggedIn, socket } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const location =  useLocation();

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

  useEffect(()=>{
    console.log("Before incluıdes");
    if(location.pathname.includes("/direct/t")){
        console.log("after incluıdes");

        setTimeout(() => {
            console.log("Set time out");
            getUnreadConversationsCount();
        }, 500);
    }
  },[location.pathname])

  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("join_messages", user.userId);

      socket.on("unread_conversations", (conversationId) => {
        console.log("Unread conversations message icon");
        setTimeout(() => {
            console.log("Set time out");
            getUnreadConversationsCount();
        }, 500);
      });
      getUnreadConversationsCount();
    }
    return () => {
        socket.off("receive_message");
        socket.off("unread_conversations");
      };
  }, [isLoggedIn]);

  return (
    <Indicator
      styles={{ indicator: { top: "5px", right: "5px" } }}
      withBorder
      inline
      color="red"
      label={count}
      size={25}
      onClick={() => navigate("/direct/inbox")}
    >
      <PiChatCircleDotsBold size={30} />
    </Indicator>
  );
};

export default MessageIcon;
