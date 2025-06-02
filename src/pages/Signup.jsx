import { useState } from 'react'
import '../styles/login.css'
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
export default function Signup(){
    const navigate = useNavigate();
    const [form, setForm] = useState({
        m_id : '',
        m_pw : '',
        m_name : '',
        m_email:'',
        m_phone:'',
        m_addr:'',
        m_addr2:''
    });
    const [isVerified,setIsVerified] = useState(false);
    const [canVerity,setCanVerity] = useState(false);
    const [code,setCode]=useState("");

    const handleChange = (e)=>{
        setForm({...form, [e.target.name] : e.target.value});
    };

    const handleSendCode = ()=>{
        alert("개발용 인증코드 : 7777777");
        setCanVerity(true);
        setIsVerified(false);

    }

    const handleVerify = () =>{
        // 아래 입력값
        if(code === "7777777"){
            alert("인증 성공");
            // 성공하면 회원가입 버튼 활성화
            setIsVerified(true);
        }else{
            alert("인증 실패");
        }
    }

    const handleSignup = async ()=>{
        try {
            // Axios로 SpringBoot 서버에 POST로 요청
            const response = await register(form);
            // console.log(response);
            if(response.data.success){
                alert("회원가입 성공");
                navigate("/login");
            }
            
        } catch (error) {
            console.error(error);
            alert("서버 오류 발생")
        }
    }

    const heandleSocialLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    }

    return(
      <div className="login-wrapper">
            <h2>회원가입</h2>
            <input type="text"
                name='m_id'
                placeholder="아이디 입력하세요"
                value={form.m_id}
                onChange={handleChange}
            />
            <input type="password"
                name='m_pw'
                placeholder="패스워드 입력하세요"
                value={form.m_pw}
                onChange={handleChange}
            />
            <input type="text"
                name='m_name'
                placeholder="이름 입력하세요"
                value={form.m_name}
                onChange={handleChange}
            />
            <input type="text"
                name='m_phone'
                placeholder="전화번호 입력하세요"
                value={form.m_phone}
                onChange={handleChange}
            />
            <input type="text"
                name='m_addr'
                placeholder="주소 입력하세요"
                value={form.m_addr}
                onChange={handleChange}
            />
            <input type="text"
                name='m_addr2'
                placeholder="상세주소 입력하세요"
                value={form.m_addr2}
                onChange={handleChange}
            />

            <div className='email-row'>
                <input type="text"
                    name='m_email'
                    placeholder="이메일 입력하세요"
                    value={form.m_email}
                    onChange={handleChange}
                />
                <button onClick={handleSendCode} disabled={!form.m_email}>인증메일보내기</button>
            </div>

            {canVerity && (
                <div className='email-row'>
                    <input type="text"
                        placeholder="인증코드 입력"
                        value={code}
                        onChange={(e)=>setCode(e.target.value)}
                    />
                    <button onClick={handleVerify} disabled={!form.m_email}>인증확인</button>
                </div>
            )}

            <button onClick={handleSignup} disabled={!isVerified}>회원가입</button>
            <button onClick={()=> heandleSocialLogin("kakao")}>카카오 로그인</button>
            <button onClick={()=> heandleSocialLogin("naver")}>네이버 로그인</button>
        </div>

    )
}