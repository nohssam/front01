import { useEffect, useRef, useState } from "react";
import { bbsCommWrite, bbsDelete, bbsDetail, bbsPwdCheck, myPage } from "../api/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
// 삭제 확인 모달 컴포넌트 분리
function DeleteModal({ pw, setPw, onConfirm, onCancel }) {
    return (
        <div className="delete-container">
            <div className="delete-block">
                <h3>게시글 비밀번호를 입력하세요.</h3>
                <input
                    type="password"
                    name="gb_subject"
                    className="sb-input"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />
                <div className="sb-btn-container">
                    <button className="btn-write" onClick={onConfirm}>확인</button>
                    <button className="btn-write" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}
export default function BbsDetail() {
    // 날짜 포맷 함수 분리
    const formatDateTime = (datetimeStr) => {
        if (!datetimeStr) return "";
        const date = datetimeStr.substring(0, 10).replace(/-/g, ".");
        const time = datetimeStr.substring(11, 16);
        return `${date} ${time}`;
    };
    const { b_idx, cPage } = useParams();
    const hasFetched = useRef(false); // 최초 실행 확인용

    const [detail, setDetail] = useState(null);
    const [comm, setComm] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [modal, setModal] = useState(false);

    const [pw, setPw] = useState("");

    const navigate = useNavigate();

    const [modalMode, setModalMode] = useState(null); // "delete" | "update"

    const [commModal, setCommModal] = useState(false);

    const [commContent, setCommContent] = useState("");


    const handleFileDown = () => {
        if (!detail.f_name) {
            return;
        }
        const fileUrl = `http://localhost:8080/api/bbs/fileDownload?f_name=${detail.f_name}`;
        window.location.href = fileUrl;
    };

    const handleCommSubmit = async () => {
        try {
            const res = await myPage(); // 내 정보 조회

            if (res.data.success) {
                const writer = res.data.data.m_name; // 로그인한 사용자 이름
                const data = {
                    writer: writer,
                    content: commContent,
                    b_idx: b_idx
                };

                const response = await bbsCommWrite(data);
                if (response.data.success) {
                    alert("댓글 등록 성공!");
                    window.location.reload(); // 댓글 다시 불러오기
                } else {
                    alert("댓글 등록 실패");
                }
            } else {
                alert("회원 정보를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("댓글 등록 에러:", error);
            alert("댓글 등록 중 오류가 발생했습니다.");
        }
    };

    // 비밀번호 확인 → 이후 처리 분기
    const handlePwCheck = async () => {
        if (!pw) {
            alert("비밀번호를 입력해주세요");
            return;
        }

        try {
            const res = await bbsPwdCheck(b_idx, pw);
            if (!res.data.success) {
                alert("비밀번호가 틀립니다");
                return;
            }

            if (modalMode === "update") {
                navigate(`/bbsUpdate/${cPage}/${b_idx}`);
            } else if (modalMode === "delete") {
                const delRes = await bbsDelete(b_idx, pw);
                if (delRes.data.success) {
                    alert("게시글 삭제 완료!");
                    navigate(`/bbs/${cPage}`);
                } else {
                    alert("삭제 실패");
                }
            }
        } catch (err) {
            console.error("비밀번호 확인 오류", err);
            setError(true);
        } finally {
            setPw("");
            setModal(false);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            const getData = async () => {
                try {
                    const response = await bbsDetail(b_idx);
                    if (response.data.success) {
                        setDetail(response.data.data.bbs);
                        setComm(response.data.data.comm);
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    console.error("서버 에러:", err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };

            getData();
            hasFetched.current = true;
        }
    }, [b_idx]);

    if (loading) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    return (
        <div className="board-wrapper">
            <h2 className="board-title">방명록</h2>
            <hr className="title-hr" />
            <div className="table-wrapper">
                <table>
                    <tbody>
                        <tr>
                            <th className="detail-th">작성자</th>
                            <td className="detail-td">{detail.writer}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">제목</th>
                            <td className="detail-td">{detail.subject}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">내용</th>
                            <td className="detail-td">{detail.content}</td>
                        </tr>
                        <tr>
                            <th className="detail-th">첨부파일</th>
                            <td className="detail-td">
                                <button
                                    type="button"
                                    className="file-down"
                                    onClick={handleFileDown}
                                    disabled={!detail.f_name}
                                >
                                    {detail.f_name || "첨부파일 없음"}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th className="detail-th">작성일</th>
                            <td className="detail-td">{formatDateTime(detail.write_date)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-container">
                <button className="btn-write" onClick={() => {
                    setModalMode("update");
                    setModal(true);
                }}>수정</button>
                <button className="btn-write" onClick={() => {
                    setModalMode("delete");
                    setModal(true);
                }}>삭제</button>
                <Link to={`/bbs/${cPage}`}><button className="btn-write">목록</button></Link>
            </div>
            <h2 className="comment-title">댓글</h2>
            <hr className="title-hr" />
            <button className="btn-write" onClick={() => setCommModal(true)}>댓글 작성</button>
            <div id="bbs-columns-wrapper">
                <div id="bbs-columns">
                    {Array.isArray(comm) && comm.length > 0 ? (
                        comm.map((c, i) => (
                            <figure key={i}>
                                <figcaption className="title">{c.content}</figcaption>
                                <figcaption className="name">
                                    <span>{c.writer}</span><br />
                                    <span>{c.write_date}</span>
                                </figcaption>
                            </figure>
                        ))
                    ) : (
                        <div className="no-comment">등록된 댓글이 없습니다.</div>
                    )}
                </div>
            </div>
            {modal && (
                <DeleteModal
                    pw={pw}
                    setPw={setPw}
                    onConfirm={handlePwCheck}
                    onCancel={() => setModal(false)}
                />
            )}
            {commModal && (
                <div className="comment-modal">
                    <h3>댓글 작성</h3>
                    <textarea
                        className="comment-textarea"
                        placeholder="댓글을 입력하세요"
                        value={commContent}
                        onChange={(e) => setCommContent(e.target.value)}
                    ></textarea>
                    <div className="comment-btn-container">
                        <button className="btn-write" onClick={handleCommSubmit}>등록</button>
                        <button className="btn-write" onClick={() => setCommModal(false)}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}