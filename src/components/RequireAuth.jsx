import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { zu_isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = localStorage.getItem("accessToken");

    if (tokens) {
      useAuthStore.getState().zu_login(); // 상태 복구
    }

    setLoading(false); // 바로 해제
  }, []);

  useEffect(() => {
    if (!loading && !zu_isLoggedIn) {
      navigate("/login");
    }
  }, [loading, zu_isLoggedIn, navigate]);

  if (loading) return <div>인증 확인 중...</div>;

  if (!zu_isLoggedIn) {
    return null; // 이미 navigate로 이동 중
  }

  return children;
}
