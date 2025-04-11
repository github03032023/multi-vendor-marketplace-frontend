// UserContext.js
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

            
  const  logout = () => {
    localStorage.clear();
    setUserName(null);
  };

    return (
        <UserContext.Provider value={{ userName, setUserName,  logout}}>
            {children}
        </UserContext.Provider>
    );
};
