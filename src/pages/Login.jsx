import { useState } from "react";
import '../styles/login.css'
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import useAuthStore from "../store/authStore";

export default function Login(){
    // 로그인 상태 호출하자  AuthContext.jsx에 있다.
    // const {setIsLoggedIn} = useAuth();
    
    // zustand
    const zu_login = useAuthStore((state)=>state.zu_login);

    const [m_id, setM_id] = useState("");
    const [m_pw, setM_pw] = useState("");
    const navigate = useNavigate();

    // Axios로 SpringBoot 서버에 POST로 요청
    const handleLogin = async () => {
        try {
            const response = await login(m_id, m_pw);
            const { accessToken } = response.data.data;

            localStorage.setItem("accessToken", JSON.stringify({ accessToken }));
            zu_login();
            navigate('/');
        } catch (error) {
            console.log(error);
            alert("로그인 실패");
        }
    }
    
    const handleSocialLogin = (provider) => {
    // const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const backendUrl = "http://localhost:8080";
    // const backendUrl = "http://nohssam.store:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

    return(
        <div className="login-wrapper">
            <h2>로그인</h2>
            <input type="text"
                value={m_id}
                onChange={(e)=>setM_id(e.target.value)}
                placeholder="아이디 입력하세요"
            />
            <input type="password"
                value={m_pw}
                onChange={(e)=>setM_pw(e.target.value)}
                placeholder="패스워드 입력하세요"
            />
         
            <button onClick={handleLogin} disabled={!m_id || !m_pw}>로그인</button>
            <button onClick={()=> handleSocialLogin("kakao")}>카카오 로그인</button>
            <button onClick={()=> handleSocialLogin("naver")}>네이버 로그인</button>
        </div>

      
    )
}