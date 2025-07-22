import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bbsDetail, bbsPwdCheck, myPage, bbsCommWrite, bbsCommDelete } from "../api/auth";
import "../styles/bbsdetail.css"

export default function BbsDetail() {
  const { b_idx, cPage } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [comm, setComm] = useState([]);
  const [pw, setPw] = useState("");
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [commContent, setCommContent] = useState("");
  const [writerName, setWriterName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, detailRes] = await Promise.all([
          myPage(),
          bbsDetail(b_idx)
        ]);
        const mvo = userRes.data.data;
        setWriterName(mvo.m_name);
        if (detailRes.data.success) {
          setDetail(detailRes.data.data.bbs);
          setComm(detailRes.data.data.comm);
        }
      } catch (err) {
        alert("로그인이 필요합니다");
        navigate("/login");
      }
    };
    fetchData();
  }, [b_idx, navigate]);

  const handlePwCheck = async () => {
    if (!pw) return alert("비밀번호 입력하세요");
    try {
      const res = await bbsPwdCheck(b_idx, pw);
      if (!res.data.success) return alert("비밀번호 오류");

      if (modalMode === "update") {
        navigate(`/bbsUpdate/${cPage}/${b_idx}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPw("");
      setModal(false);
    }
  };

  const handleCommSubmit = async () => {
    if (!commContent.trim()) return;
    try {
      const payload = { writer: writerName, content: commContent, b_idx };
      const response = await bbsCommWrite(payload);
      if (response.data.success) {
        setCommContent("");
        const updated = await bbsDetail(b_idx);
        setComm(updated.data.data.comm);
      }
    } catch (err) {
      alert("댓글 등록 오류");
    }
  };

  const handleDeleteComment = async (c_idx) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await bbsCommDelete(c_idx);
      if (res.data.success) {
        alert("댓글 삭제 완료");
        const updated = await bbsDetail(b_idx);
        setComm(updated.data.data.comm);
      } else {
        alert("삭제 실패");
      }
    } catch (err) {
      alert("서버 오류");
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
                <button
                  disabled={!detail.f_name}
                  onClick={() => {
                    const encodedName = encodeURIComponent(detail.f_name);
                    const url = `http://localhost:8080/api/bbs/fileDownload?f_name=${encodedName}`;
                    //const url = `https://nohssam.store:8080/api/bbs/fileDownload?f_name=${encodedName}`;
                    window.open(url, "_blank"); // 새 창으로 다운로드
                  }}
                >
                  {detail.f_name || "첨부파일 없음"}
                </button>
              </td>
            </tr>
            <tr><th>작성일</th><td>{detail.write_date}</td></tr>
          </tbody>
        </table>
      </div>

      <div className="bbs-btn-container">
        <div className="bbs-action-wrap">
          <button className="bbs-action-btn" onClick={() => {
            setModal(true);
            setModalMode("update");
          }}>수정</button>
          <button onClick={() => navigate(`/bbs/${cPage}`)}>목록</button>
        </div>
      </div>

      <div className="bbs-comment-section">
        <h3 className="bbs-title">댓글</h3>
        <div className="bbs-comment-editor">
          <strong className="bbs-comment-writer-label">{writerName}</strong>
          <textarea
            className="bbs-comment-textarea"
            placeholder="댓글을 남겨보세요"
            value={commContent}
            onChange={(e) => setCommContent(e.target.value)}
          />
          <div className="bbs-comment-actions">
            <button className="bbs-action-btn" onClick={handleCommSubmit}>등록</button>
          </div>
        </div>

        {comm.length > 0 ? comm.map((c, i) => (
          <div key={i} className="bbs-comment-box">
            <div className="bbs-comment-header">
              <span className="bbs-comment-writer">{c.writer}</span>
              <span className="bbs-comment-date">{c.write_date}</span>
            </div>
            <div className="bbs-comment-body">
              {c.content}
              {c.writer === writerName && (
                <button className="bbs-comment-delete" onClick={() => handleDeleteComment(c.c_idx)}>삭제</button>
              )}
            </div>
          </div>
        )) : <p className="bbs-message">댓글 없음</p>}
      </div>

      {modal && (
        <div className="bbs-modal">
          <div className="bbs-modal-inner">
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              className="bbs-modal-input"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <div>
              <button onClick={handlePwCheck}>확인</button>
              <button onClick={() => setModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
