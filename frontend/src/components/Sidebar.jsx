import React, { useState } from "react";
import { useAppContext } from "../contexts/Appcontext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ menuopen, setmenuopen }) => {
  const {
    theme,
    setselectedchat,
    chats,
    settheme,
    user,
    navigate,
    selectedchat,
    createNewchat,
    axios,
    setchats,
    fetchUserchats,
    settoken,
    token,
  } = useAppContext();
  const [search, setsearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    toast.success("logout successfully");
  };

  const deleteChat = async (chatId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat permanently?"
    );

    if (!confirmDelete) {
      throw new Error("Cancelled"); // IMPORTANT
    }

    const { data } = await axios.delete(`/api/chat/deletechat/${chatId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!data.success) {
      throw new Error(data.message || "Delete failed");
    }

    setchats((prev) => prev.filter((chat) => chat._id !== chatId));
    return data.message;
  };

  return (
    <div
      className={`
      flex flex-col h-screen min-w-72 p-5
      dark:bg-gradient-to-b dark:from-[#242124]/30 dark:to-[#000000]/30
      border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500
      max-md:absolute left-0 z-10 ${!menuopen && "max-md:-translate-x-full"}`}
    >
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="logo"
        className="w-full max-w-48"
      />

      {/* new chat button */}
      <button
        onClick={() => {
          createNewchat();
          navigate("/");
        }}
        className="
          flex justify-center items-center w-full py-2 mt-10
          text-white text-sm rounded-md cursor-pointer
          bg-gradient-to-r from-[#A456F7] to-[#3D81F6]
        "
      >
        <span className="mr-2 text-xl">+</span>
        New Chat
      </button>

      {/* search conversations */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
        <input
          type="text"
          value={search}
          placeholder="search conversations"
          onChange={(e) => setsearch(e.target.value)}
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* chat history recent */}
      <div className="flex-1 overflow-y-auto mt-4">
        {chats.length > 0 && <p className="text-sm mb-2">recent chats</p>}

        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              onClick={() => {
                setselectedchat(chat);
                navigate("/");
                setmenuopen(false);
              }}
              key={chat._id}
              className={`p-2 px-4 border rounded-md cursor-pointer flex items-center gap-3 group mb-2
  ${
    selectedchat?._id === chat._id
      ? "bg-purple-600/20 border-purple-500 dark:bg-[#57317C]/30 dark:border-[#80609f]"
      : "dark:bg-[#57317C]/10 border-gray-300 dark:border-[#80609f]/15"
  }
`}
            >
              <div className="flex-1 min-w-0">
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                onClick={(e) => {
                  e.stopPropagation();
                  toast.promise(deleteChat(chat._id), {
                    loading: "Deleting...",
                    success: "Chat deleted",
                    error: "Failed to delete chat",
                  });
                }}
                className=" w-4 cursor-pointer not-dark:invert"
                alt="delete"
              />
            </div>
          ))}
      </div>

      {/* community images */}
      <div
        onClick={() => {
          navigate("/community");
          setmenuopen(false);
        }}
        className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 mt-1
             border border-gray-300 dark:border-white/15
             rounded-md cursor-pointer
             hover:scale-103 transition-all"
      >
        <img
          src={assets.gallery_icon}
          className="w-4 sm:w-4.5 not-dark:invert"
          alt=""
        />
        <div className="flex flex-col text-xs sm:text-sm">
          <p>community images</p>
        </div>
      </div>

      {/* credit purchase option */}
      <div
        onClick={() => {
          navigate("/credits");
          setmenuopen(false);
        }}
        className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 mt-1
             border border-gray-300 dark:border-white/15
             rounded-md cursor-pointer
             hover:scale-103 transition-all"
      >
        <img
          src={assets.diamond_icon}
          className="w-4 sm:w-4.5 dark:invert"
          alt=""
        />
        <div className="flex flex-col text-xs sm:text-sm">
          <p>Credits : {user?.credits}</p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            purchase credits to use mine ai
          </p>
        </div>
      </div>

      {/* dark mode toggle */}
      <div
        className="flex items-center justify-between gap-2 p-2 sm:p-2.5 mt-1
             border border-gray-300 dark:border-white/15 rounded-md"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <img
            src={assets.theme_icon}
            className="w-3.5 sm:w-4 not-dark:invert"
            alt=""
          />
          <p>Dark mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => settheme(theme === "dark" ? "light" : "dark")}
          />
          <div
            className="w-8 h-4 sm:w-9 sm:h-5 bg-gray-400 rounded-full
                    peer-checked:bg-purple-600 transition-all"
          ></div>
          <span
            className="absolute left-1 top-1 w-2.5 h-2.5 sm:w-3 sm:h-3
                     bg-white rounded-full transition-transform
                     peer-checked:translate-x-3 sm:peer-checked:translate-x-4"
          ></span>
        </label>
      </div>

      {/* user account */}
      <div
        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 mt-1 rounded-md
             cursor-pointer border border-gray-300 dark:border-white/15
             hover:bg-gray-100 dark:hover:bg-white/5
             transition group"
      >
        <img
          src={assets.user_icon}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
          alt="User"
        />

        <p
          className="flex-1 text-xs sm:text-sm font-medium
                text-gray-800 dark:text-gray-200 truncate"
        >
          {user ? user.name : "Login to your account"}
        </p>

        {user && (
          <img
            src={assets.logout_icon}
            onClick={() => logout()}
            className="h-4 sm:h-5 opacity-0 group-hover:opacity-100
                 transition cursor-pointer not-dark:invert"
            alt="Logout"
          />
        )}
      </div>

      <img
        onClick={() => setmenuopen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-4 sm:w-5 h-4 sm:h-5
             cursor-pointer md:hidden not-dark:invert
             hover:scale-110 transition"
        alt="Close"
      />
    </div>
  );
};

export default Sidebar;
