import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestBookDelete, guestBookDetail, myPage } from "../api/auth";
import "../styles/guestbook.css";
import DownloadButton from "../components/DownloadButton";

// 날짜 포맷 함수
const formatDateTime = (datetimeStr) => {
    if (!datetimeStr) return "";
    const date = datetimeStr.substring(0, 10).replace(/-/g, ".");
    const time = datetimeStr.substring(11, 16);
    return `${date} ${time}`;
};

// 삭제 모달 컴포넌트 (비밀번호 입력)
function DeleteModal({ password, setPassword, onConfirm, onCancel }) {
    return (
        <div className="delete-container">
            <div className="delete-block">
                <h3>비밀번호를 입력하세요</h3>
                <input
                    type="password"
                    name="gb_pw"
                    className="sb-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
    const [password, setPassword] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState(""); // presigned URL 저장용
    const isImageFile = (filename) => {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
    };

    const handleSbCheck = async () => {
        if (!password) {
            alert("비밀번호를 입력하세요");
            return;
        }

        try {
            const response = await guestBookDelete(gb_idx, password);
            if (response.data.success) {
                alert("게시글 삭제 완료!");
                navigate("/guestbook");
            } else {
                alert("삭제 실패: " + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("서버 오류 발생");
        }
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
                    const data = detailRes.data.data;
                    setDetail(data);

                     // 콘솔로 확인: 이 값이 presigned URL이면 안 됩니다
                    console.log(" gb_f_name (S3 Key):", data.gb_f_name);
                    
                    //  썸네일 presigned URL 요청
                   if (data.gb_f_name && isImageFile(data.gb_f_name)) {
                     
                        const res = await fetch(
                            `http://nohssam.store:8080/api/guestbook/image?fileName=${encodeURIComponent(data.gb_f_name)}`
                        );
                        const result = await res.json();
                        if (result.success) {
                            setThumbnailUrl(result.data);
                        }
                    }
                    
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
    if (error || !detail) return <div className="message">ERROR</div>;

    const isOwner = detail.gb_email === userEmail;

    return (
        <div className="bbs-wrapper">
            <h2 className="bbs-title">방명록</h2>
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
                                {detail.gb_f_name ? (
                                    <div>
                                        <DownloadButton
                                            gb_f_name={detail.gb_f_name}
                                            gb_old_f_name={detail.gb_old_f_name}
                                        />
                                        {isImageFile(detail.gb_f_name) && thumbnailUrl && (
                                            <div className="thumbnail-box">
                                                <img
                                                    src={thumbnailUrl} //  presigned URL로 변경
                                                    alt="썸네일"
                                                    className="thumbnail-image"
                                                    style={{
                                                        maxWidth: "100px",
                                                        marginTop: "10px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px"
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span style={{ color: "#888" }}>첨부파일 없음</span>
                                )}
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
                    password={password}
                    setPassword={setPassword}
                    onConfirm={handleSbCheck}
                    onCancel={() => {
                        setModal(false);
                        setPassword("");
                    }}
                />
            )}
        </div>
    );
}
