
import { jwtDecode } from 'jwt-decode';


export const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken?.userId) {
            return {
                userId: decodedToken.userId,
                role: decodedToken.role,
            };
        }else if (decodedToken && decodedToken?.vendorId) {
            return {
                  vendorId : decodedToken.vendorId,
                  role: "vendor",
            };
        }
       
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
