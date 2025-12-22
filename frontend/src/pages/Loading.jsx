import React, { useEffect } from "react";
import { useAppContext } from "../contexts/Appcontext";

const Loading = () => {
  const { navigate, fetchUser } = useAppContext();
  useEffect(() => {
    const timeout = setTimeout(async () => {
      await fetchUser();
      navigate("/");
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="bg-gradient-to-b from-[#531B81] to-[#29184B]
                    flex items-center justify-center
                    min-h-[100dvh] w-full overflow-hidden
                    text-white text-2xl"
    >
      <div
        className="w-10 h-10 rounded-full border-4
                      border-white border-t-transparent
                      animate-spin"
      ></div>
    </div>
  );
};

export default Loading;
