import { useEffect, useState } from 'react';
import '../styles/guestbook.css';
import { guestBook } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Guestbook() {
    const [guestlist, setGuestlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 로그인 안 되어 있으면 로그인 페이지로 이동
    // useEffect(() => {
    //     const token = localStorage.getItem("accessToken");
    //     if (!token) {
    //         alert("로그인이 필요합니다.");
    //         navigate("/login");
    //     }
    // }, [navigate]);

    // ✅ 방명록 목록 로딩
    useEffect(() => {
        const guestbooklist = async () => {
            try {
                const response = await guestBook();
                const data = response.data?.data;
                setGuestlist(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        guestbooklist();
    }, []);

    //  날짜 포맷
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = isoString.substring(0, 10).replace(/-/g, '.');
        const time = isoString.substring(11, 16);
        return `${date} ${time}`;
    };

    //  글쓰기 페이지 이동
    const handleInsert = () => {
        navigate("/guestbookInsert");
    };

    //  로딩 및 에러 처리
    if (loading) return <div className="center-text">로딩중...</div>;
    if (error) return <div className="center-text">에러 발생: {error}</div>;

    return (
        <div className="table-wrapper">
            <button className="button-insert" type="button" onClick={handleInsert}>방명록 등록하기</button>
            <table className="table-controll">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {guestlist.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="center-text">작성된 방명록이 없습니다.</td>
                        </tr>
                    ) : (
                        guestlist.map(k => (
                            <tr key={k.gb_idx}>
                                <td>{k.gb_idx}</td>
                                <td className="left-text">
                                    <Link to={`/guestBookDetail/${k.gb_idx}`}>{k.gb_subject}</Link>
                                </td>
                                <td>{k.gb_name}</td>
                                <td>{formatDateTime(k.gb_regdate)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
