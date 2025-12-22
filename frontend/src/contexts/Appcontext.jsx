import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const Appcontext = createContext();

export const useAppContext = () => useContext(Appcontext);

export const AppcontextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [chats, setchats] = useState([]);
  const [selectedchat, setselectedchat] = useState(null);
  const [theme, settheme] = useState(localStorage.getItem("theme") || "light");
  const [token, settoken] = useState(localStorage.getItem("token") || null);
  const [loadinguser, setloadinguser] = useState(true);
  const fetchUser = async () => {
    try {
      const {data} = await axios.get("/api/user/getuser", {
        headers: {
          Authorization: token,
        },
      });

      if (data.success) {
        setuser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setloadinguser(false);
    }
  };

  const createNewchat = async () => {
    try {
      if (!user) {
        toast("login to create new chat");
        return navigate("/");
      }
      await axios.post("/api/chat/createchat",{}, {
        headers: {
          Authorization: token,
        },
      });
      await fetchUserchats();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchUserchats = async () => {
    try {
      const { data } = await axios.get("/api/chat/getchats", {
        headers: {
          Authorization: token,
        },
      });
      if (data.success) {
        setchats(data.chats);
        //new user
        if (data.chats.length === 0 && chats.length === 0) {
  await createNewchat();
}

        else{
            setselectedchat(data.chats[0])
        }
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error(error.message)
    }
  };
  useEffect(() => {
    if(token){
            fetchUser();
    }else{
        setuser(null);
        setloadinguser(false);
    }

  }, [token]);
  useEffect(() => {
    if (theme == "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    if (user) {
      fetchUserchats();
    } else {
      setchats([]);
      setselectedchat(null);
    }
  }, [user]);
  let value = {
    navigate,
    user,
    setuser,
    chats,
    setchats,
    selectedchat,
    setselectedchat,
    theme,
    settheme,createNewchat,loadinguser,fetchUserchats,token,settoken,axios
  };
  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};
