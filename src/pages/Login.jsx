import { useState } from "react";
import '../styles/login.css'
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login({setIsLoggedIn}){
    const [m_id, setM_id] = useState("");
    const [m_pw, setM_pw] = useState("");
    const navigate = useNavigate();

    const handleLogin = async()=>{
        // Axios로 SpringBoot 서버에 POST로 요청
        try {
            const response = await login(m_id, m_pw) ;
            console.log(response);
            // 로그인 성공화면 home 으로 이동 
            // 단 이동 전에 로그인 성공했다고 기억해야 된다.(localStorage에)
            localStorage.setItem("token","admin");
            // App.js 에서 isLoggedIn를 변경하지 위해 
            // main으로 갈때 값을 기억시켜야 한다.
            setIsLoggedIn(true);
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