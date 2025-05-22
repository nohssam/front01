import { Link } from "react-router-dom";
import '../styles/header.css'

export default function Header(){
     
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
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
            </div>
        </div>
      </header>
    )
}