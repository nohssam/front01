import { useState } from "react";
import { guestBookInsert } from "../api/auth";
import { useNavigate } from "react-router-dom";
import '../styles/guestbookinsert.css';


export default function GuestbookInsert() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ gb_content: "", gb_pw: "", gb_subject: "", file: null });
    const handleFileChange = (e) => {
        setForm((prev) => ({
            ...prev,
            file: e.target.files[0] // ✅ 파일 객체를 저장
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    const handleEdit = async (action) => {
        if (action === 1) {
            try {
                // 등록
                const formdata = new FormData();
                formdata.append("gb_subject", form.gb_subject);
                formdata.append("gb_content", form.gb_content);
               formdata.append("gb_file", form.file); 
                formdata.append("gb_pw", form.gb_pw);
                const res = await guestBookInsert(formdata);
                alert("등록 완료");
                navigate(`/guestBookDetail/${res.data.data.gb_idx}`);
            } catch (error) {
                console.log(error.message)
            }
        } else if (action === 2) {
            navigate(`/guestbook`);
        }
    };
    return (
        <div className="insert-wrapper">
    <table className="insert-table">
        <tbody>
            <tr>
                <th>Subject</th>
                <td><input className="detail-input" name="gb_subject" type="text" value={form.gb_subject} onChange={handleChange} /></td>
            </tr>
            <tr>
                <th>Content</th>
                <td>
                    <textarea className="detail-input" name="gb_content" rows="10" onChange={handleChange} value={form.gb_content} />
                </td>
            </tr>
            <tr>
                <th>Writing PW</th>
                <td><input className="detail-input" name="gb_pw" type="password" value={form.gb_pw} onChange={handleChange} /></td>
            </tr>
            <tr>
                <th>Attachment</th>
                <td><input className="detail-input" type="file" name="file" onChange={handleFileChange} /></td>
            </tr>
            <tr>
                <td colSpan="2" className="button-row">
                    <button type="button" onClick={() => handleEdit(1)}>등록</button>
                    <button type="button" onClick={() => handleEdit(2)}>취소</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
    );
}