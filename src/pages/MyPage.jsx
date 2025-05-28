import { useEffect, useState } from "react"
import { myPage } from "../api/auth";

export default function MyPage(){
    const [member, setMember] = useState();

    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const m_idx = localStorage.getItem("token");
                const response = await myPage(m_idx);
                console.log(response);

                if(response.data.success){
                    setMember(response.data.data);
                } 
            } catch (error) {
                console.error("가져오기 실패", error)
            }
        };

      fetchData();
    },[]);
    return(
        <div>
            {member?(
            <>
                <h2>{member.m_name}님 환영합니다.</h2>
                <div>
                    <p>아이디 : {member.m_id}</p>
                    <p>이름 : {member.m_name}</p>
                    <p>이메일 : {member.m_email}</p>
                    <p>전화번호 : {member.m_phone}</p>
                </div>
             </>       
            ) :( <p>로딩 중 ... </p>)}
           
        </div>
    )
}