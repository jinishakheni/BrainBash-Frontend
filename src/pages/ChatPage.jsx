import { createRef, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { createConversation } from "../helper/utils.jsx";

const ChatPage = () => {
  const { user, isLoggedIn, socket } = useContext(AuthContext);
  const [conversationList, setConversationList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const navigate = useNavigate();

  let messagesEnd = createRef();
  const scrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollTop = messagesEnd.current.scrollHeight;
    }
  };

  const { chatId } = useParams();

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/conversations/${user.userId}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setConversationList(responseData);
      }
    } catch (error) {
      console.log(error, "on fetching conversations");
    }
  };

  const removeUnreadMessages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/unread-conversations/${chatId}/${
          user.userId
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const responseData = await response.json();

      if (responseData.hadUnreadMessages) {
        fetchConversations();
      }
    } catch (error) {
      console.log(error, "on removing unread messages from db");
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${chatId}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setMessageList(responseData);

        socket.emit("join_chat", chatId);
        console.log("join_chat");

        socket.on("receive_message", (data) => {
          setMessageList((prevList) => [...prevList, data]);
        });
      }
    } catch (error) {
      console.log(error, "on fetching messages");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchConversations();
      socket.on("unread_conversations2", (conversationId) => {
        if (conversationId === chatId) {
          removeUnreadMessages();
          return;
        }
        fetchConversations();
      });
      if (chatId) {
        fetchMessages();
        removeUnreadMessages();
      }
    }
    return () => {
      socket.off("receive_message");
      socket.off("unread_conversations2");
    };
  }, [chatId]);

  const sendMessage = async () => {
    const messageContent = {
      chatId: chatId,
      content: {
        sender: user.userId,
        message: currentMessage,
      },
    };

    await socket.emit("send_message", messageContent);
    console.log("Message has sent");
    setCurrentMessage("");
  };

  const handleMessageInput = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleMessageClick = async (participantId) => {
    try {
      const conversationId = await createConversation(
        user.userId,
        participantId
      );
      navigate(`/direct/t/${conversationId}`);
    } catch (error) {
      console.log(error, "on creating and navigating to the conversation");
    }
  };

  if (!isLoggedIn && conversationList.length === 0) {
    return <p>Loading all messages . . .</p>;
  }

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">QuickChat</div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Active Conversations</span>
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                {conversationList.length}
              </span>
            </div>
            <div
              style={{ height: "45rem" }}
              className="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto"
            >
              {conversationList.map((conversation, index) => {
                const fullName = conversation.participants[0].fullName;
                return (
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                    onClick={() =>
                      handleMessageClick(conversation.participants[0]._id)
                    }
                    key={index}
                  >
                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                      {fullName.charAt(0)}
                    </div>
                    <div className="ml-2 text-sm font-semibold">{fullName}</div>
                    {conversation.count !== 0 && (
                      <div class="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
                        {conversation.count}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            {chatId && (
              <>
                <div
                  className="flex flex-col h-full overflow-x-auto mb-4"
                  ref={messagesEnd}
                >
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-12 gap-y-2">
                      {messageList.map((message, index) => {
                        const initialLetter =
                          message.sender.firstName.charAt(0);
                        return message.sender._id === user.userId ? (
                          <div
                            className="col-start-6 col-end-13 p-3 rounded-lg"
                            key={index}
                          >
                            <div className="flex items-center justify-start flex-row-reverse">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                {initialLetter}
                              </div>
                              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                <div>{message.message}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="col-start-1 col-end-8 p-3 rounded-lg"
                            key={index}
                          >
                            <div className="flex flex-row items-center">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                {initialLetter}
                              </div>
                              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                <div>{message.message}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        value={currentMessage}
                        onChange={(e) => handleMessageInput(e)}
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                      onClick={sendMessage}
                    >
                      <span>Send</span>
                      <span className="ml-2">
                        <svg
                          className="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <h3>You're in the Chat Page </h3>
    //   <div className="chatContainer">
    //     <div className="messages">
    //       {messageList.map((val) => {
    //         return (
    //           <div
    //             key={val._id}
    //             className="messageContainer"
    //             id={val.sender.name == user.name ? "You" : "Other"}
    //           >
    //             <div className="messageIndividual">
    //               {val.sender.name}: {val.message}
    //             </div>
    //           </div>
    //         );
    //       })}
    //       <div
    //         style={{ float: "left", clear: "both" }}
    //         ref={(el) => {
    //           messagesEnd = el;
    //         }}
    //       ></div>
    //     </div>
    //     <div className="messageInputs">
    //       <input
    //         value={currentMessage}
    //         type="text"
    //         placeholder="Message..."
    //         onChange={handleMessageInput}
    //       />
    //       <button onClick={sendMessage}>Send</button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ChatPage;
