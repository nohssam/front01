import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { geustBookInsert } from "../api/auth";


export default function GuestBookInsert() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    const formData = new FormData();
    formData.append("gb_subject", subject);
    formData.append("gb_content", content);
    if (file) {
      formData.append("gb_file", file);
    }

    try {
      const response = await geustBookInsert(formData);

      const gb_idx = response.data.data.gb_idx; // 등록된 글 번호

      alert("등록 성공!");
      navigate(`/guestBookDetail/${gb_idx}`); // 등록 후 상세보기로 이동

    } catch (error) {
      alert("등록 실패: " + error.response?.data?.message || error.message);
    }
  };

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
          <button className="btn-write" type="submit">
            등록
          </button>
        </div>
      </div>
    </form>
  );
}
