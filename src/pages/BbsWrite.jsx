import { useState } from "react";
import "../styles/guestbook.css";
import { useNavigate } from "react-router-dom";
import { bbsWrite } from "../api/auth";

export default function BbsWrite() {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [pwd, setPwd] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => setter(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("content", content);
        formData.append("pwd", pwd);
        if (file) formData.append("file", file);

        try {
            const response = await bbsWrite(formData);
            const b_idx = response.data.data.b_idx;
            alert("등록 성공!");
            navigate(`/bbsDetail/${b_idx}`);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert("등록 실패: " + msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="bbs-wrapper">
                <h2 className="bbs-title">게시판(BBS)</h2>
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
                                    <input
                                        className="input"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="detail-th">게시글 비밀번호</th>
                                <td className="detail-td">
                                    <input
                                        className="input"
                                        type="password"
                                        value={pwd}
                                        onChange={handleInputChange(setPwd)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="btn-container">
                    <button className="btn-write" type="submit">등록</button>
                </div>
            </div>
        </form>
    );
}
