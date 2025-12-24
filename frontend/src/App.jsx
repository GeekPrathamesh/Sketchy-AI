import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Chatbox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import { useAppContext } from "./contexts/Appcontext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadinguser } = useAppContext();
  const [menuopen, setmenuopen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadinguser) return <Loading />;

  return (
    <>
      {user ? (
        <>
          {!menuopen && (
            <img
              src={assets.menu_icon}
              onClick={() => setmenuopen(true)}
              className="absolute top-3 left-3 w-11 h-11 cursor-pointer md:hidden not-dark:invert fixed"
              alt="menu"
            />
          )}

          <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
            <div className="flex min-h-[100dvh] w-full ">
              <Sidebar menuopen={menuopen} setmenuopen={setmenuopen} />

              <Routes>
                <Route path="/" element={<Chatbox />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}

      <Toaster />
    </>
  );
};

export default App;
