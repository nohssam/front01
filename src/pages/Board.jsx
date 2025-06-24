import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardList } from "../api/auth";

export default function Board() {
    const [board, setBoard] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // offset을 인자로 받는 fetch 함수
    const fetchBoardList = useCallback(async (offsetParam) => {
        setLoading(true);
        try {
            const res = await boardList({ offset: offsetParam, limit });
            console.log("게시글 목록 불러오기 성공", res.data);
            const newList = res.data.data;

            if (newList.length < limit) {
                setHasMore(false);
            }

            setBoard((prev) => [...prev, ...newList]);
        } catch (err) {
            console.error("게시글 목록 불러오기 실패", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    // 최초 한 번만 실행
    useEffect(() => {
        fetchBoardList(0);
    }, [fetchBoardList]);

    // 더보기 버튼 핸들러
    const handleLoadMore = () => {
        fetchBoardList(offset);
        setOffset((prev) => prev + limit);
    };

    if (loading && board.length === 0) return <div className="message">Loading...</div>;
    if (error) return <div className="message">ERROR</div>;

    return (
        <>
            <img src="https://i.pinimg.com/736x/ea/84/11/ea8411f8fb915dcd3eea5378f34decfd.jpg" className="board-img" alt="img" />
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
                            {board.map((k, i) => (
                                <tr key={i}>
                                    <td>{board.length - i}</td>
                                    <td>{k.writer}</td>
                                    <td>
                                        {k.active === "0" ? (
                                            <Link to={`/bbsDetail/1/${k.b_idx}`}>{k.title}</Link>
                                        ) : (
                                            <span className="deleted">삭제된 게시물입니다.</span>
                                        )}
                                    </td>
                                    <td>{k.regdate.substring(0, 10).replace(/-/g, ".")} {k.regdate.substring(11, 16)}</td>
                                    <td>{k.hit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {hasMore && (
                        <div className="btn-container">
                            <button onClick={handleLoadMore} className="btn-write" disabled={loading}>
                                {loading ? "불러오는 중..." : "더보기"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="btn-container">
                    <Link to="/bbsWrite">
                        <button className="btn-write">글쓰기</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
