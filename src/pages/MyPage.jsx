import { useEffect, useState } from "react"
import { myPage } from "../api/auth";

export default function MyPage(){
   const [member, setMember] = useState(null);
   const [loading, setLoading] = useState(true);  // 로딩 상태
   const [error, setError] = useState(null);      // 에러 상태
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await myPage(); // AccessToken 자동 포함됨 (interceptor)
        console.log("마이페이지 응답:", response);

        if (response.data.success) {
          setMember(response.data.data);
        } else {
          setError("회원 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("마이페이지 호출 실패:", err);
        setError("로그인이 만료되었거나 서버 오류입니다.");
      } finally {
        setLoading(false); // ✅ 성공이든 실패든 로딩 종료
      }
     };

     fetchData();
    }, []);

     // 로딩 중
  if (loading) return <div>로딩 중 ...</div>;

  // 에러 발생
  if (error) return <div style={{ color: "red" }}>{error}</div>;

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