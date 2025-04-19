import React, { useState, useEffect, useMemo } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiMore2Fill } from "react-icons/ri";
import SearchModule from "./SearchModule";
import { auth, db, listenForChats } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Chatlist = ({ setSelectedUser }) => {
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth?.currentUser?.uid) return;

    const userDocRef = doc(db, "user", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      const userData = doc.data();
      if (userData) setUser(userData);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);
    return () => unsubscribe();
  }, []);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTime = a?.lastMessageTimestamp?.seconds || 0;
      const bTime = b?.lastMessageTimestamp?.seconds || 0;
      return bTime - aTime;
    });
  }, [chats]);

  const startChat = (user) => setSelectedUser(user);

  return (
    <section
      className="relative hidden md:flex flex-col items-start justify-start h-[100vh] w-full md:w-[480px] border-r"
      style={{ backgroundColor: "#d4f1f4", borderColor: "#003d40" }}
    >
      {/* Top Header */}
      <header
        className="flex items-center justify-between w-full border-b p-4 sticky md:static top-0 z-[100]"
        style={{ borderColor: "#003d40" }} // deeper border
      >
        <main className="flex items-center gap-3">
          <img
            src={defaultAvatar}
            className="h-[44px] w-[44px] object-cover rounded-full"
            alt="Profile"
          />
          <span>
            <h3
              className="font-semibold text-[17px]"
              style={{ color: "#0097a7" }} // username header
            >
              {user?.fullName || auth?.currentUser?.displayName || "Your Name"}
            </h3>
            <p className="text-[15px]" style={{ color: "#005f6a" }}>
              {" "}
              {/* email/username */}
              {user?.username || auth?.currentUser?.email || "you@example.com"}
            </p>
          </span>
        </main>
        <button
          className="w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: "#ffffff" }}
        >
          <RiMore2Fill color="#003d40" />
        </button>
      </header>

      {/* Message header + search */}
      <div className="px-5 w-full mt-[10px]">
        <header className="flex items-center justify-between">
          <h3 className="text-[16px]" style={{ color: "#0097a7" }}>
            Messages {chats.length}
          </h3>
          <SearchModule startChat={startChat} />
        </header>
      </div>

      {/* Chat list */}
      <main className="custom-scrollbar flex flex-col items-start mt-[1.5rem] pb-3 w-full">
        {sortedChats?.map((chat) => {
          const otherUser = chat?.users?.find(
            (u) => u?.email !== auth?.currentUser?.email
          );
          if (!otherUser) return null;

          const formattedTime = chat?.lastMessageTimestamp?.seconds
            ? new Date(
                chat.lastMessageTimestamp.seconds * 1000
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "";

          return (
            <button
              key={chat?.id}
              onClick={() => startChat(otherUser)}
              className="flex items-start justify-between w-full px-5 py-2 hover:bg-[#003d40]/10 transition-all duration-150"
              style={{ borderBottom: "1px solid #005f6a33" }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={otherUser.image || defaultAvatar}
                  className="h-[40px] w-[40px] object-cover rounded-full"
                  alt={otherUser.fullName}
                />
                <span>
                  <h2
                    className="font-semibold text-[17px]"
                    style={{ color: "#0097a7" }}
                  >
                    {otherUser.username}
                  </h2>
                  <p className="text-[14px]" style={{ color: "#005f6a" }}>
                    {chat.lastMessage || "No message yet"}
                  </p>
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "#003d40" }}>
                {formattedTime}
              </p>
            </button>
          );
        })}
      </main>
    </section>
  );
};

export default Chatlist;
