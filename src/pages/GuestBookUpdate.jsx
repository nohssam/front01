import { useEffect, useState } from "react";
import { guestBookDetail, guestBookUpdate } from "../api/auth";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/guestbookupdate.css";

export default function GuestBookUpdate() {
    const navigate = useNavigate();
    const { gb_idx } = useParams();

    const [detail, setDetail] = useState(null);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleFileDown = () => {
        if (!detail.gb_f_name) return;
        const fileUrl = `http://localhost:8080/api/guestbook/fileDownload?gb_f_name=${detail.gb_f_name}`;
        window.location.href = fileUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("gb_idx", gb_idx);
        formData.append("gb_subject", subject);
        formData.append("gb_content", content);
        if (file) formData.append("gb_file", file);

        try {
            const response = await guestBookUpdate(formData);
            const newIdx = response.data.data.gb_idx; // 기존 gb_idx 변수와 충돌 방지
            alert("수정 성공!");
            navigate(`/guestBookDetail/${newIdx}`);
        } catch (error) {
            alert("수정 실패: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        const fetchGuestBook = async () => {
            try {
                const { data } = await guestBookDetail(gb_idx);
                if (data.success) {
                    const g = data.data;
                    setDetail(g);
                    setSubject(g.gb_subject);
                    setContent(g.gb_content);
                } else {
                    throw new Error("데이터 불러오기 실패");
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchGuestBook();
    }, [gb_idx]);

    if (loading) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="bbs-wrapper">
                <h2 className="bbs-title">방명록</h2>
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
                                        name="gb_subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="detail-th">내용</th>
                                <td className="detail-td">
                                    <textarea
                                        className="input"
                                        name="gb_content"
                                        cols="20"
                                        rows="15"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    ></textarea>
                                </td>
                            </tr>
                            <tr>
                                <th className="detail-th">첨부파일</th>
                                <td className="detail-td">
                                    <p className="pre-file">
                                        기존 파일:&nbsp;
                                        {detail.gb_f_name ? (
                                            <button
                                                type="button"
                                                className="file-down"
                                                onClick={handleFileDown}
                                            >
                                                {detail.gb_old_f_name}
                                            </button>
                                        ) : (
                                            <span style={{ color: "#888" }}>첨부파일 없음</span>
                                        )}
                                    </p>
                                    <input
                                        className="input"
                                        type="file"
                                        name="gb_file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="btn-container">
                    <button className="btn-write" type="submit">저장</button>
                    <button className="btn-write" type="button" onClick={() => navigate("/guestbook")}>돌아가기</button>
                </div>
            </div>
        </form>
    );
}
