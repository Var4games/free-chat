import React, { useState } from "react";
import {
  RiArrowDownSFill,
  RiBardLine,
  RiChatAiLine,
  RiFile4Line,
  RiFolderUserLine,
  RiNotificationLine,
  RiShutDownLine,
} from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Navlinks = () => {
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("✅ Successfully logged out");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDevelopmentClick = () => {
    showToast("🚧 Feature in development");
  };

  const icons = [
    {
      key: "chat",
      icon: <RiChatAiLine />,
      onClick: handleDevelopmentClick,
    },
    {
      key: "folder",
      icon: <RiFolderUserLine />,
      onClick: handleDevelopmentClick,
    },
    {
      key: "notification",
      icon: <RiNotificationLine />,
      onClick: handleDevelopmentClick,
    },
    {
      key: "file",
      icon: <RiFile4Line />,
      onClick: handleDevelopmentClick,
    },
    {
      key: "bard",
      icon: <RiBardLine />,
      onClick: handleDevelopmentClick,
    },
    {
      key: "logout",
      icon: <RiShutDownLine />,
      onClick: handleLogout,
    },
  ];

  return (
    <section
      className="sticky top-0 flex items-center lg:items-start lg:static lg:justify-start h-[7vh] lg:h-[100vh] w-[100%] lg:w-[150px] py-8 lg:py-0"
      style={{ backgroundColor: "#005f6a" }} // <- Dark Cyan base
    >
      <main className="flex lg:flex-col justify-between items-center lg:gap-10 lg:px-0 w-[100%]">
        {/* Logo */}
        <div className="flex items-start justify-center border-b border-[#d4f1f4] lg:w-[100%] p-4">
          <span className="flex items-center justify-center">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="w-[56px] h-[48px] object-contain bg-white rounded-lg p-2"
            />
          </span>
        </div>

        {/* Icons */}
        <ul className="flex lg:flex-col flex-row gap-7 px-2 items-center">
          {icons.map((item) => (
            <li key={item.key}>
              <button
                className="lg:text-[28px] text-[22px] hover:bg-[#003d40] p-2 rounded transition-all"
                onClick={item.onClick}
                style={{ color: "#d4f1f4" }} // Light Aqua for icons
              >
                {item.icon}
              </button>
            </li>
          ))}
        </ul>

        {/* Dropdown Icon for Mobile */}
        <button
          className="lg:text-[28px] text-[22px] block lg:hidden"
          style={{ color: "#d4f1f4" }}
        >
          <RiArrowDownSFill />
        </button>
      </main>

      {toastMessage && (
        <div
          className="fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-[999] text-sm font-medium animate-fade-in"
          style={{
            backgroundColor: "#d4f1f4", // toast background
            color: "#003d40", // deep text for contrast
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default Navlinks;
