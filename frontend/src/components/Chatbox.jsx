import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../contexts/Appcontext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const Chatbox = () => {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    navigate,
    user,
    setuser,
    chats,
    setchats,
    selectedchat,
    setselectedchat,
    theme,
    settheme,
    createNewchat,
    loadinguser,
    fetchUserchats,
    token,
    settoken,
    axios,
  } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setpromt] = useState("");
  const [mode, setmode] = useState("text");
  const [published, setpublished] = useState(false);

  const onsubmit = async (e) => {
    try {
      e.preventDefault();
      if (!prompt.trim()) return toast.error("enter the prompt first");
      if (!user) return toast("login to interact with sketchy ai");

      setLoading(true);
      const userPrompt = prompt;
      setpromt("");

      // add user message immediately
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: userPrompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      // text mode
      if (mode === "text") {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/message/text`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              chatId: selectedchat._id,
              prompt: userPrompt,
            }),
          }
        );

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          isImage: false,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const token = line.replace("data: ", "");

            if (token === "[DONE]") {
              setuser((prev) => ({ ...prev, credits: prev.credits - 1 }));
              setLoading(false);
              return;
            }

            assistantMessage.content += token;

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...assistantMessage };
              return updated;
            });
          }
        }
      }

      /* ===================== IMAGE MODE (NORMAL) ===================== */
      if (mode === "image") {
        const { data } = await axios.post(
          `/api/message/image`,
          {
            chatId: selectedchat._id,
            prompt: userPrompt,
            isPublished: published,
          },
          { headers: { Authorization: token } }
        );

        if (!data.success) throw new Error(data.message);

        setMessages((prev) => [...prev, data.reply]);
        setuser((prev) => ({ ...prev, credits: prev.credits - 2 }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      setpublished(false);
    }
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

  useEffect(() => {
    if (mode !== "image") {
      setpublished(false);
    }
  }, [mode]);

  return (
    <div className="flex flex-1 justify-between m-4 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-20 flex-col  ">
      {/* chat messages    */}
      <div ref={containerRef} className="flex-1 mb-10 overflow-y-scroll">
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

   <form
  onSubmit={onsubmit}
  className="
    fixed bottom-5 left-1/2 -translate-x-1/2
    w-[calc(100%-2rem)] max-w-2xl
    bg-primary/20 dark:bg-[#583C79]/30
    border border-primary dark:border-[#80609F]/30
    rounded-xl
    backdrop-blur-xl
    z-30
  "
>
  {/* IMAGE MODE SECTION */}
  {mode === "image" && (
    <div className="px-4 py-1.5 border-b border-white/10">
      <label className="mx-auto w-fit flex items-center gap-2 text-[11px] text-gray-300">
        <input
          type="checkbox"
          className="cursor-pointer scale-90"
          checked={published}
          onChange={(e) => setpublished(e.target.checked)}
        />
        Publish generated image to the community
      </label>
    </div>
  )}

  {/* INPUT SECTION */}
  <div className="px-4 py-2 flex gap-3 items-center">
    <select
      className="text-xs px-2 outline-none bg-transparent"
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
      className="
        flex-1 w-full text-sm
        outline-none resize-none
        overflow-y-auto bg-transparent
      "
      rows={1}
      value={prompt}
      onChange={(e) => {
        setpromt(e.target.value);
        const el = textareaRef.current;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 140) + "px";
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
        className="w-7 cursor-pointer"
      />
    </button>
  </div>
</form>


    </div>
  );
};

export default Chatbox;
