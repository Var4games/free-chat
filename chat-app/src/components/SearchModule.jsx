import React, { useState } from "react";
import defaultAvatar from "../../public/assets/default.jpg";
import { RiSearch2Line } from "react-icons/ri";
import { FaSearchengin, FaXmark } from "react-icons/fa6";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SearchModule = ({ startChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }
    try {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const q = query(
        collection(db, "user"),
        where("username", ">=", normalizedSearchTerm),
        where("username", "<=", normalizedSearchTerm + "\uf8ff")
      );
      const querySnapShot = await getDocs(q);
      const foundUsers = [];
      querySnapShot.forEach((doc) => {
        foundUsers.push(doc.data());
      });
      console.log("found User : ", foundUsers);

      setUsers(foundUsers);
      if (foundUsers.length === 0) {
        alert("No user found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-[#d4f1f4] w-[35px] h-[35px] p-2 items-center justify-center rounded-lg shadow"
      >
        <RiSearch2Line color="#0097a7" className="w-[18px] h-[18px]" />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-center items-center bg-[#003d40b7]"
          onClick={closeModal}
        >
          <div
            className="relative p-4 w-full max-w-md max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#0097a7] w-full rounded-md shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#d4f1f4]">
                <h3 className="text-xl font-semibold text-white">
                  Search Chat
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-[#d4f1f4] hover:text-[#0097a7] rounded-lg text-sm w-8 h-8 flex items-center justify-center transition"
                >
                  <FaXmark size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="text"
                      placeholder="Search by username..."
                      className="bg-[#d4f1f4] border border-[#0097a766] text-[#0097a7] text-sm rounded-lg outline-none w-full p-2.5 placeholder:text-[#0097a788]"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-[#0097a7] text-white px-3 py-2 rounded-lg hover:bg-[#22706a] transition"
                    >
                      <FaSearchengin />
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="mt-6">
                  {users?.map((user) => (
                    <div
                      key={user.uid}
                      onClick={() => {
                        startChat(user);
                        closeModal();
                      }}
                      className="flex items-start gap-3 bg-[#d4f1f4] p-2 mb-3 rounded-lg cursor-pointer border border-[#0097a744] shadow-md hover:shadow-lg transition"
                    >
                      <img
                        src={user?.image || defaultAvatar}
                        alt="avatar"
                        className="h-[40px] w-[40px] rounded-full object-cover"
                      />
                      <span>
                        <h2 className="font-semibold text-[#0097a7] text-[18px]">
                          {user.fullName}
                        </h2>
                        <p className="text-[13px] text-[#0097a7cc]">
                          @{user.username}
                        </p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModule;
