import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bbsDelete, bbsDetail, bbsPwdCheck, myPage, bbsCommWrite } from "../api/auth";
import "../styles/bbs.css";

export default function BbsDetail() {
    const { b_idx, cPage } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [comm, setComm] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [pw, setPw] = useState("");
    const [modal, setModal] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [commModal, setCommModal] = useState(false);
    const [commContent, setCommContent] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, detailRes] = await Promise.all([
                    myPage(),
                    bbsDetail(b_idx)
                ]);

                const mvo = userRes.data.data;
                const email = mvo.m_email || mvo.sns_email_kakao || mvo.sns_email_naver || "";
                setUserEmail(email);

                if (detailRes.data.success) {
                    setDetail(detailRes.data.data.bbs);
                    setComm(detailRes.data.data.comm);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [b_idx]);

    const isOwner = detail?.email === userEmail;

    const handleFileDown = () => {
        if (!detail?.f_name) return;
        const url = `http://localhost:8080/api/bbs/fileDownload?f_name=${detail.f_name}`;
        window.location.href = url;
    };

    const handlePwCheck = async () => {
        if (!pw) return alert("비밀번호 입력하세요");
        try {
            const res = await bbsPwdCheck(b_idx, pw);
            if (!res.data.success) return alert("비밀번호 오류");

            if (modalMode === "update") {
                navigate(`/bbsUpdate/${cPage}/${b_idx}`);
            } else if (modalMode === "delete") {
                const del = await bbsDelete(b_idx, pw);
                if (del.data.success) {
                    alert("삭제 완료");
                    navigate(`/bbs/${cPage}`);
                } else {
                    alert("삭제 실패");
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setPw("");
            setModal(false);
        }
    };

    const handleCommSubmit = async () => {
        try {
            const res = await myPage();
            if (!res.data.success) return alert("회원 정보 오류");
            const writer = res.data.data.m_name;
            const payload = { writer, content: commContent, b_idx };
            const response = await bbsCommWrite(payload);
            if (response.data.success) {
                alert("댓글 등록 완료");
                window.location.reload();
            }
        } catch (err) {
            alert("댓글 등록 오류");
        }
    };

    if (!detail) return <div className="bbs-message">Loading...</div>;

    return (
        <div className="bbs-wrapper">
            <h2 className="bbs-title">게시판</h2>
            <div className="bbs-table-wrapper">
                <table className="bbs-table">
                    <tbody>
                        <tr><th>작성자</th><td>{detail.writer}</td></tr>
                        <tr><th>제목</th><td>{detail.subject}</td></tr>
                        <tr><th>내용</th><td>{detail.content}</td></tr>
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                <button disabled={!detail.f_name} onClick={handleFileDown}>
                                    {detail.f_name || "첨부파일 없음"}
                                </button>
                            </td>
                        </tr>
                        <tr><th>작성일</th><td>{detail.write_date}</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="bbs-btn-container">
                {isOwner && (
                    <>
                        <button className="bbs-action-btn" onClick={() => { setModal(true); setModalMode("update"); }}>수정</button>
                        <button className="bbs-action-btn" onClick={() => { setModal(true); setModalMode("delete"); }}>삭제</button>
                    </>
                )}
                <button onClick={() => navigate(`/bbs/${cPage}`)}>목록</button>
            </div>

            <h3 className="bbs-title">댓글</h3>
            <button className="bbs-action-btn" onClick={() => setCommModal(true)}>댓글 작성</button>
            <div className="bbs-comment-wrapper">
                {comm.length > 0 ? comm.map((c, i) => (
                    <div key={i} className="bbs-comment">
                        <p>{c.content}</p>
                        <span>{c.writer} | {c.write_date}</span>
                    </div>
                )) : <p className="bbs-message">댓글 없음</p>}
            </div>

            {modal && (
                <div className="bbs-modal">
                    <div className="bbs-modal-inner">
                        <h3>비밀번호 확인</h3>
                        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
                        <div>
                            <button onClick={handlePwCheck}>확인</button>
                            <button onClick={() => setModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {commModal && (
                <div className="bbs-modal">
                    <div className="bbs-modal-inner">
                        <h3>댓글 작성</h3>
                        <textarea rows="4" value={commContent} onChange={(e) => setCommContent(e.target.value)} />
                        <div>
                            <button onClick={handleCommSubmit}>등록</button>
                            <button onClick={() => setCommModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
