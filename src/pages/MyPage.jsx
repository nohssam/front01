import { useEffect, useState } from "react";
import { myPage } from "../api/auth";
import "../styles/mypage.css"; // 새로 만든 CSS 파일 import

export default function MyPage() {
    const [member, setMember] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await myPage();
                if (response.data.success) {
                    setMember(response.data.data);
                } else {
                    setError("회원정보를 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error("가져오기 실패", err);
                setError("회원정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div className="mypage-error">{error}</div>;

    return (
        <div className="mypage-container">
            <div className="mypage-title">{member.m_name}님 환영합니다.</div>
            <table className="mypage-table">
                <thead>
                    <tr>
                        <th>항목</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>아이디</td><td>{member.m_id}</td></tr>
                    <tr><td>이름</td><td>{member.m_name}</td></tr>
                    <tr><td>이메일</td><td>{member.m_email || "없음"}</td></tr>
                    <tr><td>전화번호</td><td>{member.m_phone || "없음"}</td></tr>
                    <tr>
                        <td>SNS 이메일</td>
                        <td>
                            {member.sns_provider === "kakao"
                                ? member.sns_email_kakao || "없음"
                                : member.sns_provider === "naver"
                                ? member.sns_email_naver || "없음"
                                : "없음"}
                        </td>
                    </tr>
                    <tr><td>SNS</td><td>{member.sns_provider || "없음"}</td></tr>
                </tbody>
            </table>
        </div>
    );
}
