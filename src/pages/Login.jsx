import { useState } from "react";
import '../styles/login.css'
import { login } from "../api/auth";

export default function Login(){
    const [m_id, setM_id] = useState("");
    const [m_pw, setM_pw] = useState("");

    const handleLogin = async()=>{
        // Axios로 SpringBoot 서버에 POST로 요청
        try {
            const response = await login(m_id, m_pw) ;
            console.log(response);
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