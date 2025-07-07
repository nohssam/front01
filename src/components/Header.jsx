import { Link, useNavigate} from "react-router-dom";
import '../styles/header.css'
// import { useAuth } from "../context/AuthContext";
import useAuthStore from "../store/authStore";
import { api } from "../api/http";


export default function Header(){
    // Context
    // const {isLoggedIn, setIsLoggedIn} = useAuth();

    // zustand
    // const {zu_isLoggedIn, zu_logout } = useAuthStore((state)=>({
    //     zu_isLoggedIn : state.zu_isLoggedIn,
    //     zu_logout : state.zu_logout,
    // }));

    const zu_isLoggedIn = useAuthStore((state) => state.zu_isLoggedIn);
    const zu_logout = useAuthStore((state) => state.zu_logout);

    const navigate = useNavigate();
     
    const handleLogout = async () => {
        try {
            const res = await api.post("/members/logout");
            console.log("로그아웃 응답:", res.data);
            if (res.data && !res.data.success) {
                alert("로그아웃 실패: " + (res.data.message || "알 수 없는 이유"));
            }
            } catch (error) {
            console.error("로그아웃 에러", error);
            alert("로그아웃 중 오류가 발생했습니다.");
            } finally {
            // ✅ 로그아웃 시 상태 초기화 (불필요한 snsProvider는 제거 가능)
            localStorage.removeItem("accessToken");
            // localStorage.removeItem("snsProvider");  // SNS 로그인 시 꼭 필요하면 주석 풀어도 됨
            zu_logout();
            navigate("/login");
            }
        };
  
    return(
      <header className="header">
        <div className="header-inner">
            {/* 왼쪽 : 로고 */}
            <div className="header-left">
                <Link to="/" className="logo-link">
                <img className="logo-image" src="/logo.png" alt="한국 ICT" />
                </Link>
            </div>
            {/* 가운데 : 방명록, 게시판, 고객센터 */}
            <div className="header-center">
                <Link to="/guestBook" >방명록</Link>
                <Link to="/bbs" >게시판1(bbs)</Link>
                <Link to="/board" >게시판2(board)</Link>
                <Link to="/support" >고객센터</Link>
            </div>
            {/* 오른쪽 : 로그인, 회원가입, 로그아웃 */}
            <div className="header-right">
                {zu_isLoggedIn ? (
                    <>
                        <button onClick={handleLogout}>로그아웃</button>
                        <Link to="/mypage">마이페이지</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
               
            </div>
        </div>
      </header>
    )
}