import { Link, useNavigate} from "react-router-dom";
import '../styles/header.css'
// import { useAuth } from "../context/AuthContext";
import useAuthStore from "../store/authStore";


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
     
    // 로그아웃 처리
     const handleLogout = () => {
        zu_logout(); // Zustand 

        // 로컬스토리지 제거
        localStorage.removeItem("snsProvider");
        //localStorage.removeItem("tokens");

        // 쿠키 삭제
        document.cookie = "snsProvider=; path=/; max-age=0";
        document.cookie = "authToken=; path=/; max-age=0";

        // 초기화
        useAuthStore.getState().zu_logout();
        navigate("/");
     }
  
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
                <Link to="/guestbook"> 방명록 </Link>
                <Link to="/bbs" > 게시판 </Link>
                <Link to="/support" > 고객센터 </Link>
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