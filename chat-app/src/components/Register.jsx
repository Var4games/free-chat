import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData?.email,
        userData?.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "user", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split("@")[0],
        fullName: userData.fullName,
        image: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-[#d4f1f4]">
      <div className="bg-[#ffffff] shadow-xl p-5 rounded-xl w-[20rem] flex flex-col justify-center items-center">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-center text-[22px] font-bold text-[#0097a7]">
            Sign Up
          </h1>
          <p className="text-center text-sm text-[#0097a7aa]">
            Welcome, create an account to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="w-full">
          <input
            type="text"
            name="fullName"
            onChange={handleChangeUserData}
            className="border border-[#0097a766] w-full p-2 rounded-md bg-[#d4f1f4] text-[#0097a7] mb-3 font-medium outline-none placeholder:text-[#0097a788]"
            placeholder="Full Name"
          />
          <input
            type="email"
            name="email"
            onChange={handleChangeUserData}
            className="border border-[#0097a766] w-full p-2 rounded-md bg-[#d4f1f4] text-[#0097a7] mb-3 font-medium outline-none placeholder:text-[#0097a788]"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            onChange={handleChangeUserData}
            className="border border-[#0097a766] w-full p-2 rounded-md bg-[#d4f1f4] text-[#0097a7] mb-3 font-medium outline-none placeholder:text-[#0097a788]"
            placeholder="Password"
          />
        </div>

        {/* Button */}
        <div className="w-full">
          <button
            disabled={isLoading}
            onClick={handleAuth}
            className="bg-[#0097a7] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center hover:bg-[#22706a] transition"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                Register <FaUserPlus />
              </>
            )}
          </button>
        </div>

        {/* Switch to login */}
        <div className="mt-5 text-center text-sm text-[#0097a7aa]">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="hover:underline"
          >
            Already have an account?{" "}
            <span className="text-[#0097a7] font-semibold">Sign In</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;
