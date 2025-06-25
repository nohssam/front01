import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RequireAuth({ children }) {
    const isLoggedIn = useAuthStore((state) => state.zu_isLoggedIn);

    if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/login" replace />;
    }

    return children;
}