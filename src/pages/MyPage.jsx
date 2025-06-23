import { useEffect, useState } from "react"
import { myPage } from "../api/auth";

export default function MyPage(){
    const [member, setMember] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(()=>{
        const fetchData = async () =>{
            try {
                //const m_idx = localStorage.getItem("tokens");
                // const response = await myPage(m_idx);
                const response = await myPage();
                console.log(response);

                if(response.data.success){
                    setMember(response.data.data);
                }else{
                    setError("회원정보를 불러올수 없습니다.");
                } 
            } catch (err) {
                console.error("가져오기 실패", err);
                setError("회원정보를 불러올수 없습니다.");
            } finally{
                setLoading(false);
            }
        };

      fetchData();
    },[]);

    if(loading) return <div>로딩 중...</div>;
    if(error) return<div style={{colors:"red"}}>{error}</div>
    return(
        <div>
            <h2>{member.m_name}님 환영합니다.</h2>
            <div>
                <p>아이디 : {member.m_id}</p>
                <p>이름 : {member.m_name}</p>
                <p>이메일 : {member.m_email}</p>
                <p>전화번호 : {member.m_phone}</p>
            </div>
        </div>
    );
}