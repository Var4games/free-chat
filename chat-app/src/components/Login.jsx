import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { auth } from "../firebase/firebase";

const Login = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({
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
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
    } catch (error) {
      console.log(error);
      alert(error.message);
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
            Sign In
          </h1>
          <p className="text-center text-sm text-[#0097a7aa]">
            Welcome back, login to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="w-full">
          <input
            type="text"
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
                Login <FaSignInAlt />
              </>
            )}
          </button>
        </div>

        {/* Toggle Link */}
        <div className="mt-5 text-center text-sm text-[#0097a7aa]">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="hover:underline"
          >
            Don&apos;t have an account yet?{" "}
            <span className="text-[#0097a7] font-semibold">Sign Up</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
