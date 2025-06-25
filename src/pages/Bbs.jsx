import { useEffect, useState } from "react";
import { bbsDelete, bbsList, bbsPwdCheck, myPage } from "../api/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/bbs.css";

export default function Bbs() {
    const { cPage } = useParams();
    const navigate = useNavigate();
    const [bbs, setbbs] = useState([]);
    const [paging, setPaging] = useState();
    const [currentPage, setCurrentPage] = useState(Number(cPage) || 1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const handleDelete = async (b_idx) => {
        const pw = prompt("게시글 비밀번호를 입력하세요");
        if (!pw) return;

        try {
            const res = await bbsPwdCheck(b_idx, pw);
            if (!res.data.success) {
                alert("비밀번호가 틀립니다");
                return;
            }

            const delRes = await bbsDelete(b_idx, pw);
            if (delRes.data.success) {
                alert("삭제 완료");
                window.location.reload();
            } else {
                alert("삭제 실패");
            }
        } catch (err) {
            console.error("삭제 오류", err);
            alert("오류 발생");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, listRes] = await Promise.all([
                    myPage(),
                    bbsList(currentPage)
                ]);

                const mvo = userRes.data.data;
                const email = mvo.m_email || mvo.sns_email_kakao || mvo.sns_email_naver || "";
                setUserEmail(email);

                if (listRes.data.success) {
                    const { bbs, paging } = listRes.data.data;
                    setbbs(bbs);
                    setPaging(paging);
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
    }, [currentPage]);

    if (loading) return <div className="bbs-message">Loading...</div>;
    if (error) return <div className="bbs-message">ERROR</div>;

    return (
        <div className="bbs-wrapper">
            <h2 className="bbs-title">게시판</h2>
            <div className="bbs-table-wrapper">
                <table className="bbs-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>작성일</th>
                            <th>조회수</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...bbs].map((k, i) => (
                            <tr key={i}>
                                <td>{paging.totalRecord - ((paging.nowPage - 1) * paging.numPerPage) - i}</td>
                                <td>{k.writer}</td>
                                <td>
                                    {k.active === 0 ? (
                                        <Link to={`/bbsDetail/${currentPage}/${k.b_idx}`}>{k.subject}</Link>
                                    ) : (
                                        <span className="bbs-deleted">삭제된 게시물입니다.</span>
                                    )}
                                </td>
                                <td>{k.write_date.substring(0, 10).replace(/-/g, ".")} {k.write_date.substring(11, 16)}</td>
                                <td>{k.hit}</td>
                                <td>
                                    {k.email === userEmail && k.active === "0" && (
                                        <>
                                            <Link to={`/bbsUpdate/${currentPage}/${k.b_idx}`}><button className="bbs-action-btn">수정</button></Link>
                                            <button className="bbs-action-btn" onClick={() => handleDelete(k.b_idx)}>삭제</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bbs-paging">
                {paging.beginBlock <= paging.pagePerBlock ? (
                    <button disabled className="bbs-disable">이전으로</button>
                ) : (
                    <button onClick={() => {
                        const target = paging.beginBlock - paging.pagePerBlock;
                        setCurrentPage(target);
                        navigate(`/bbs/${target}`);
                    }}>이전으로</button>
                )}
                {Array.from({ length: paging.endBlock - paging.beginBlock + 1 }, (_, i) => {
                    const k = paging.beginBlock + i;
                    return (
                        <span key={k}>
                            {k === paging.nowPage ? (
                                <button className="bbs-now">{k}</button>
                            ) : (
                                <button onClick={() => {
                                    setCurrentPage(k);
                                    navigate(`/bbs/${k}`);
                                }}>{k}</button>
                            )}
                        </span>
                    );
                })}
                {paging.endBlock >= paging.totalPage ? (
                    <button disabled className="bbs-disable">다음으로</button>
                ) : (
                    <button onClick={() => {
                        const target = paging.beginBlock + paging.pagePerBlock;
                        setCurrentPage(target);
                        navigate(`/bbs/${target}`);
                    }}>다음으로</button>
                )}
            </div>

            <div className="bbs-btn-container">
                <Link to="/bbsWrite"><button>글쓰기</button></Link>
            </div>
        </div>
    );
}
