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
    const handleLogin = async()=>{
        try {
            const response = await login(m_id, m_pw) ;
            // const m_idx = response.data.data.m_idx;
            // const m_name = response.data.data.m_name;
            console.log(response);
            const {accessToken, refreshToken} = response.data.data ;

            // localStorage 저장하기, 토큰만 저장
            localStorage.setItem("tokens", JSON.stringify({accessToken, refreshToken }));
            
            // 로그인 성공화면 home 으로 이동 
            // 단 이동 전에 로그인 성공했다고 기억해야 된다.(localStorage에)
            // localStorage.setItem("m_idx",m_idx);
            // localStorage.setItem("name",m_name);
            // App.js 에서 isLoggedIn를 변경하지 위해 
            // main으로 갈때 값을 기억시켜야 한다.
            
            // setIsLoggedIn(true);

            zu_login();
            navigate('/');

        } catch (error) {
            console.log(error);
            alert("로그인 실패");
        }
    }
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
        </div>

      
    )
}