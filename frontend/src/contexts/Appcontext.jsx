import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const Appcontext = createContext();

export const useAppContext = () => useContext(Appcontext);

export const AppcontextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user,setuser]=useState(null);
    const [chats,setchats]=useState([]);
    const [selectedchat,setselectedchat]=useState(null);
    const [theme,settheme]=useState(localStorage.getItem("theme") || "light");

    const fetchUser = ()=>{
        setuser(dummyUserData);
    };
    const fetchUserchats=()=>{
        setchats(dummyChats);
        setselectedchat(null);
    }
    useEffect(()=>{
        fetchUser();
    },[])
    useEffect(()=>{
        if(theme=="dark"){
            document.documentElement.classList.add("dark");
        }
        else{
            document.documentElement.classList.remove("dark");
           
        }
        localStorage.setItem("theme",theme);
    },[theme])
    useEffect(()=>{
        if(user){
            fetchUserchats();
        }
        else{
            setchats([]);
            setselectedchat(null)
        }
    },[user])
  let value = {navigate,user,setuser,chats,setchats,selectedchat,setselectedchat,theme,settheme};
  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};
