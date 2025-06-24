import { useEffect, useState } from "react";
import { bbsList } from "../api/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/guestbook.css";

export default function Bbs() {
    const { cPage } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [paging, setPaging] = useState();
    const [currentPage, setCurrentPage] = useState(Number(cPage) || 1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await bbsList(currentPage);
                if (response.data.success) {
                    const { board, paging } = response.data.data;
                    setBoard(board);
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
        getData();
    }, [currentPage]);

    if (loading) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    return (
        <>
        <img src="https://i.pinimg.com/736x/ea/84/11/ea8411f8fb915dcd3eea5378f34decfd.jpg" className="board-img" alt="img"></img>
            <div className="board-wrapper">
                <h2 className="board-title">게시판</h2>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>작성자</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...board].map((k, i) => (
                                <tr key={i}>
                                    <td>{paging.totalRecord - ((paging.nowPage - 1) * paging.numPerPage) - i}</td>
                                    <td>{k.writer}</td>
                                    <td>
                                        {k.active === "0" ? (
                                            <Link to={`/bbsDetail/${currentPage}/${k.b_idx}`}>{k.subject}</Link>
                                        ) : (
                                            <span className="deleted">삭제된 게시물입니다.</span>
                                        )}
                                    </td>
                                    <td>{k.write_date.substring(0, 10).replace(/-/g, ".")} {k.write_date.substring(11, 16)}</td>
                                    <td>{k.hit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <span className="paging">
                    {/* 이전으로 */}
                    {paging.beginBlock <= paging.pagePerBlock ? (
                        <button disabled className="disable">이전으로</button>
                    ) : (
                        <button onClick={() => {
                            const target = paging.beginBlock - paging.pagePerBlock;
                            setCurrentPage(target);
                            navigate(`/bbs/${target}`);
                        }}>
                            이전으로
                        </button>
                    )}
                    {/* 페이지 번호 */}
                    {Array.from({ length: paging.endBlock - paging.beginBlock + 1 }, (_, i) => {
                        const k = paging.beginBlock + i;
                        return (
                            <span key={k}>
                                {k === paging.nowPage ? (
                                    <button className="now">{k}</button>
                                ) : (
                                    <button onClick={() => {
                                        setCurrentPage(k);
                                        navigate(`/bbs/${k}`);
                                    }}>{k}</button>
                                )}
                            </span>
                        );
                    })}
                    {/* 다음으로 */}
                    {paging.endBlock >= paging.totalPage ? (
                        <button disabled className="disable">다음으로</button>
                    ) : (
                        <button onClick={() => {
                            const target = paging.beginBlock + paging.pagePerBlock;
                            setCurrentPage(target);
                            navigate(`/bbs/${target}`);
                        }}>
                            다음으로
                        </button>
                    )}
                </span>

                <div className="btn-container">
                    <Link to="/bbsWrite"><button className="btn-write">글쓰기</button></Link>
                </div>
            </div>
        </>
    );
}
