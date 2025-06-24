import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bbsDetail, bbsUpdate } from "../api/auth";

export default function BbsUpdate() {
    const { b_idx, cPage } = useParams();
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState(null);
    const [comm, setComm] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => setter(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleFileDown = () => {
        if (!detail.gb_f_name) return;
        const fileUrl = `http://localhost:8080/api/bbs/fileDownload?f_name=${detail.f_name}`;
        window.location.href = fileUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("content", content);
        formData.append("b_idx", b_idx);
        if (file) formData.append("file", file);

        try {
            const response = await bbsUpdate(formData);
            const b_idx = response.data.data.b_idx;
            alert("수정 성공!");
            navigate(`/bbsDetail/${cPage}/${b_idx}`);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert("수정 실패: " + msg);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await bbsDetail(b_idx);
                if (response.data.success) {
                    const data = response.data.data.bbs;
                    setDetail(data);
                    setSubject(data.subject);   // 초기값 설정
                    setContent(data.content);   // 초기값 설정
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
    }, [b_idx]);

    if (loading) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="board-wrapper">
                <h2 className="board-title">방명록</h2>
                <hr className="title-hr" />
                <div className="table-wrapper">
                    <table>
                        <tbody>
                            <tr>
                                <th className="detail-th">제목</th>
                                <td className="detail-td">
                                    <input
                                        className="input"
                                        type="text"
                                        value={subject}
                                        onChange={handleInputChange(setSubject)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="detail-th">내용</th>
                                <td className="detail-td">
                                    <textarea
                                        className="input"
                                        cols="20"
                                        rows="15"
                                        value={content}
                                        onChange={handleInputChange(setContent)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="detail-th">첨부파일</th>
                                <td className="detail-td">
                                    <p className="pre-file">
                                        기존 파일:&nbsp;
                                        {detail.f_name ? (
                                            <button
                                                type="button"
                                                className="file-down"
                                                onClick={handleFileDown}
                                            >
                                                {detail.f_name}
                                            </button>
                                        ) : (
                                            <span style={{ color: "#888" }}>첨부파일 없음</span>
                                        )}
                                    </p>
                                    <input
                                        className="input"
                                        type="file"
                                        name="file"
                                        onChange={handleFileChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="btn-container">
                    <button className="btn-write" type="submit">등록</button>
                    <Link to={`/bbsDetail/${cPage}/${b_idx}`}><button className="btn-write">취소</button></Link>
                </div>
                <h2 className="comment-title">댓글</h2>
                <hr className="title-hr" />
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
            </div>
        </form>
    );
}