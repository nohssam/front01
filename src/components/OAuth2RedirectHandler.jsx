import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const zu_login = useAuthStore((state) => state.zu_login);

  useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const accessToken = queryParams.get('accessToken');
      console.log("accessToken:"+ accessToken);

      if (accessToken) {
        localStorage.setItem("accessToken", JSON.stringify({ accessToken: accessToken }));
        zu_login();  // 로그인 상태 유지
        // navigate("/");
        window.location.href = "/"
      } else {
        console.log("accessToken 없음 - 로그인 실패");
        navigate("/login");
      }
}, [navigate, zu_login]);


  return <p>소셜 로그인 처리 중 입니다 ....</p>;
}
