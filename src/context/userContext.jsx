import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [vendorId, setVendorId] = useState(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                let role = null;
                let userId = null;
                let vendorId = null;
                userId = localStorage.getItem("userId");
                vendorId = localStorage.getItem("vendorId");
                const userName = localStorage.getItem("userName");
                // setting into context
                if (userId) {
                    role = localStorage.getItem("role");
                    setUserId(userId);
                } else if (vendorId) {
                    role = "vendor";
                    setVendorId(vendorId);
                }
                setRole(role);
                setUserName(userName);
            }

        } catch (error) {
            console.error("Invalid token. User Context not set.", error);
        }
  }, []);

const logout = () => {
    localStorage.clear();
    setUserName(null);
    setRole(null);
    setUserId(null);
    setVendorId(null);
};

return (
    <UserContext.Provider
        value={{
            userName,
            role,
            userId,
            vendorId,
            setUserName,
            setRole,
            setUserId,
            setVendorId,
            logout,
        }}
    >
        {children}
    </UserContext.Provider>
);
};

