import { useState } from "react";
import Button from "../components/Button";

export default function Login(){
    const [m_id, setM_id] = useState("");
    const [m_pw, setM_pw] = useState("");

    const handleLogin = async()=>{
        // Axios로 SpringBoot 서버에 POST로 요청
    }
    return(
      <>
        <h1>로그인</h1>
        <div>
            <p>
            <label>아이디 : </label>
            <input type="text"
                    value={m_id}
                    onChange={(e)=>setM_id(e.target.value)}
                   style={{margin:"5px", padding:"5px"}}
            />
            </p>
            <p>
            <label>패스워드 : </label>
            <input type="password"
                    value={m_pw}
                    onChange={(e)=>setM_pw(e.target.value)}
                   style={{margin:"5px", padding:"5px"}}
            />
            </p>
            <Button text="로그인" onClick={handleLogin} />
            <Button text="회원가입" />
        </div>

      </>
    )
}