import React, { useEffect, useMemo, useRef, useState } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiDotsVertical } from "react-icons/hi";
import { Menu } from "@headlessui/react";
import {
  auth,
  deleteMessage,
  editMessage,
  listenForMessage,
  sendMessage,
} from "../firebase/firebase";

const Chatbox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [toast, setToast] = useState("");

  const scrollRef = useRef(null);
  const user2 = selectedUser?.uid;
  const chatId =
    auth?.currentUser?.uid < user2
      ? `${auth?.currentUser?.uid}-${user2}`
      : `${user2}-${auth?.currentUser?.uid}`;

  const senderEmail = auth?.currentUser?.email;
  const user1 = auth?.currentUser?.uid;

  useEffect(() => {
    listenForMessage(chatId, setMessages);
  }, [chatId]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime = a?.timestamp?.seconds || 0;
      const bTime = b?.timestamp?.seconds || 0;
      return aTime - bTime;
    });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMessage = {
      sender: senderEmail,
      text: messageText,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
    };
    sendMessage(messageText, chatId, user1, user2);
    setMessages((prev) => [...prev, newMessage]);
    sendMessageText("");
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);

      return () => clearTimeout(timer); // cleanup if the component unmounts or toast changes early
    }
  }, [toast]);

  return (
    <>
      {selectedUser ? (
        <section
          className="flex flex-col h-screen w-full"
          style={{ backgroundColor: "#d4f1f4" }}
        >
          {/* Header */}
          <header
            className="w-full flex items-center gap-4 p-4 border-b"
            style={{ borderColor: "#003d40" }}
          >
            <img
              src={selectedUser?.selectedUser?.image || defaultAvatar}
              className="w-10 h-10 object-cover rounded-full"
              alt="avatar"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#0097a7]">
                {selectedUser?.fullName || "Empty Name"}
              </h3>
              <p className="text-sm text-[#005f6a]">
                @{selectedUser?.username || "freechat"}
              </p>
            </div>
          </header>

          {/* Chat Messages */}
          <main className="flex-1 overflow-y-auto px-4 py-4" ref={scrollRef}>
            {sortedMessages?.map((msg, index) => {
              const isSender = msg?.sender === senderEmail;
              return (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSender && (
                    <img
                      src={defaultAvatar}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                      alt="avatar"
                    />
                  )}
                  <div
                    className={`relative max-w-[80%] sm:max-w-[70%] md:max-w-[60%] p-3 rounded-lg shadow text-sm ${
                      isSender
                        ? "text-white rounded-br-none"
                        : "text-[#005f6a] bg-white rounded-bl-none"
                    }`}
                    style={{
                      backgroundColor: isSender ? "#0097a7" : "#ffffff",
                    }}
                  >
                    <p className="break-words">{msg.text}</p>
                    <p
                      className="text-[10px] text-right mt-1"
                      style={{ color: isSender ? "#d4f1f4" : "#003d40" }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </p>

                    {isSender && (
                      <div className="absolute top-1 right-1 text-white">
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <Menu.Button>
                            <HiDotsVertical className="h-4 w-4" />
                          </Menu.Button>
                          <Menu.Items className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setEditMessageId(msg.id);
                                    setEditText(msg.text);
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm text-blue-400 ${
                                    active ? "bg-gray-100" : ""
                                  }`}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({ open: true, id: msg.id })
                                  }
                                  className={`w-full text-left px-4 py-2 text-sm text-red-600 ${
                                    active ? "bg-gray-100" : ""
                                  }`}
                                >
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </main>

          {/* Edit Message Form */}
          {editMessageId && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await editMessage(chatId, editMessageId, editText);
                setEditMessageId(null);
                setEditText("");
                setToast("Message updated successfully");
              }}
              className="flex gap-2 p-3 border-t bg-[#d4f1f4]"
            >
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
                placeholder="Edit your message"
              />
              <button
                type="submit"
                className="bg-[#0097a7] text-white px-4 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMessageId(null);
                  setEditText("");
                }}
                className="text-gray-500"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="w-full flex items-center gap-3 p-3 border-t"
            style={{ backgroundColor: "#d4f1f4", borderColor: "#003d40" }}
          >
            <input
              onChange={(e) => sendMessageText(e.target.value)}
              value={messageText}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border bg-white focus:outline-none focus:ring-2"
              style={{
                borderColor: "#005f6a",
                color: "#005f6a",
                boxShadow: "0 0 0 2px #005f6a33",
              }}
            />
            <button
              type="submit"
              className="p-2 rounded-full text-white transition"
              style={{ backgroundColor: "#0097a7" }}
            >
              <RiSendPlaneFill className="w-5 h-5" />
            </button>
          </form>
        </section>
      ) : (
        <section
          className="h-screen w-full"
          style={{ backgroundColor: "#d4f1f4" }}
        >
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-[30px] font-bold text-[#0097a7]">
              Welcome to Free Chat
            </h1>
            <p className="text-[#005f6a]">Connect and chat with friends</p>
          </div>
        </section>
      )}

      {/* Confirm Delete Dialog */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-[#003d40b7]">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="text-lg font-semibold mb-4 text-[#003d40]">
              Are you sure you want to delete this message?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm({ open: false, id: null })}
                className="px-4 py-2 border rounded bg-[#0097a7] text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteMessage(chatId, deleteConfirm.id);
                  setDeleteConfirm({ open: false, id: null });
                  setToast("Message deleted successfully");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0097a7] text-white px-4 py-2 rounded shadow z-50">
          {toast}
          <button className="ml-2 font-bold" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default Chatbox;
