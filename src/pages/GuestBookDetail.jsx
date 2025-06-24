import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestBookDelete, guestBookDetail, myPage } from "../api/auth";
import "../styles/guestbookdetail.css";

// 날짜 포맷 함수 분리
const formatDateTime = (datetimeStr) => {
    if (!datetimeStr) return "";
    const date = datetimeStr.substring(0, 10).replace(/-/g, ".");
    const time = datetimeStr.substring(11, 16);
    return `${date} ${time}`;
};

// 삭제 확인 모달 컴포넌트 분리
function DeleteModal({ subject, setSubject, onConfirm, onCancel }) {
    return (
        <div className="delete-container">
            <div className="delete-block">
                <h3>게시글 제목을 똑같이 입력하세요</h3>
                <input
                    type="text"
                    name="gb_subject"
                    className="sb-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <div className="sb-btn-container">
                    <button className="btn-write" onClick={onConfirm}>확인</button>
                    <button className="btn-write" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default function GuestBookDetail() {
    const navigate = useNavigate();
    const { gb_idx } = useParams();

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [modal, setModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [subject, setSubject] = useState("");

    const handleSbCheck = async () => {
        if (!subject || detail.gb_subject !== subject.trim()) {
            alert("제목이 틀립니다");
            return;
        }

        try {
            const response = await guestBookDelete(gb_idx);
            if (response.data.success) {
                alert("게시글 삭제 완료!");
                navigate("/guestbook");
            } else {
                alert("게시글 삭제 실패");
            }
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    const handleFileDown = () => {
        if (!detail.gb_f_name) {
            return;
        }
        const fileUrl = `http://localhost:8080/api/guestbook/fileDownload?gb_f_name=${detail.gb_f_name}`;
        window.location.href = fileUrl;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, detailRes] = await Promise.all([
                    myPage(),
                    guestBookDetail(gb_idx)
                ]);

                const mvo = userRes.data.data;
                setUserEmail(
                    mvo.m_email || mvo.sns_email_kakao || mvo.sns_email_naver || ""
                );

                if (detailRes.data.success) {
                    setDetail(detailRes.data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gb_idx]);

    if (loading) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    const isOwner = detail.gb_email === userEmail;

    return (
        <div className="board-wrapper">
            <h2 className="board-title">방명록</h2>
            <hr className="title-hr" />
            <div className="table-wrapper">
                <table>
                    <tbody>
                        <tr>
                            <th className="detail-th">작성자</th>
                            <td className="detail-td">{detail.gb_name}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">제목</th>
                            <td className="detail-td">{detail.gb_subject}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">내용</th>
                            <td className="detail-td">{detail.gb_content}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">첨부파일</th>
                            <td className="detail-td">
                                <button
                                    type="button"
                                    className="file-down"
                                    onClick={handleFileDown}
                                    disabled={!detail.gb_f_name}
                                >
                                    {detail.gb_old_f_name || "첨부파일 없음"}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th className="detail-th">작성일</th>
                            <td className="detail-td">{formatDateTime(detail.gb_regdate)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="btn-container">
                {isOwner ? (
                    <>
                        <button className="btn-write" onClick={() => navigate(`/guestBookUpdate/${detail.gb_idx}`)}>수정</button>
                        <button className="btn-write" onClick={() => setModal(true)}>삭제</button>
                        <button className="btn-write" onClick={() => navigate("/guestbook")}>목록</button>
                    </>
                ) : (
                    <button className="btn-write" onClick={() => navigate("/guestbook")}>목록</button>
                )}
            </div>

            {modal && (
                <DeleteModal
                    subject={subject}
                    setSubject={setSubject}
                    onConfirm={handleSbCheck}
                    onCancel={() => setModal(false)}
                />
            )}
        </div>
    );
}
