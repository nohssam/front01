import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { zu_isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = localStorage.getItem("tokens");

    if (tokens) {
      useAuthStore.getState().zu_login(); // 상태 복원
    }

    // 상태 복원 후 최소 지연을 주고 로딩 해제
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  if (loading) return <div>인증 확인 중...</div>;

  if (!zu_isLoggedIn) {
    navigate("/login");
    return null;
  }

  return children;
}
