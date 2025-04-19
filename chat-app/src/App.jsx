import React, { useEffect, useState } from "react";
import Navlinks from "./components/Navlinks";
import Chatlist from "./components/Chatlist";
import Chatbox from "./components/Chatbox";
import Login from "./components/Login";
import Register from "./components/Register";
import { auth } from "./firebase/firebase";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }

    const unsubcribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubcribe();
  }, []);

  return (
    <div>
      {user ? (
        <div className="flex lg:flex-row sm:flex-col items-start w-[100%]">
          <Navlinks />
          <Chatlist setSelectedUser={setSelectedUser} />
          <Chatbox selectedUser={selectedUser} />
        </div>
      ) : (
        <div>
          {isLogin ? (
            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
          ) : (
            <Register isLogin={isLogin} setIsLogin={setIsLogin} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
