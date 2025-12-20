import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../contexts/Appcontext";
import { assets } from "../assets/assets";
import Message from "./Message";

const Chatbox = () => {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const { selectedchat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setpromt] = useState("");
  const [mode, setmode] = useState("text");
  const [published, setpublished] = useState("false");

  const onsubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedchat) {
      setMessages(selectedchat.messages);
    }
  }, [selectedchat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-20 flex-col  ">
      {/* chat messages    */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              className="w-full max-w-56 sm:max-w-68"
              alt=""
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything..
            </p>
          </div>
        )}

        {messages.map((message, idx) => (
          <Message key={idx} message={message} />
        ))}

        {/* 3 dots loading */}
        {loading && (
          <div className="loader flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto ">
          <p className="text-xs ">Publish Generated image to the community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={published}
            onChange={(e) => setpublished(e.target.checked)}
          />
        </label>
      )}

      {/* prompt for chatting section  */}
      <form
        onSubmit={onsubmit}
        className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-2xl w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          className="text-sm pl-3 pr-2 outline-null"
          onChange={(e) => setmode(e.target.value)}
          value={mode}
        >
          <option value="text" className="dark:bg-purple-900">
            Text
          </option>
          <option value="image" className="dark:bg-purple-900">
            Image
          </option>
        </select>
        <textarea
          ref={textareaRef}
          placeholder="enter your prompt here.."
          className="flex-1 w-full text-md outline-none resize-none overflow-y-auto bg-transparent"
          rows={1}
          value={prompt}
          onChange={(e) => {
            setpromt(e.target.value);

            const el = textareaRef.current;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 160) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onsubmit(e);
            }
          }}
        />

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
