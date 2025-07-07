import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import useAuthStore from './store/authStore';
import { useEffect, useState } from 'react';

// import GuestBook from './pages/GuestBook';
import GuestBook from './pages/GuestBook';
import GuestBookDetail from './pages/GuestBookDetail';
import GuestBookInsert from './pages/GuestBookInsert';
import GuestBookUpdate from './pages/GuestBookUpdate';
import Bbs from './pages/Bbs';
import BbsDetail from './pages/BbsDetail';
import BbsWrite from './pages/BbsWrite';
import BbsUpdate from './pages/BbsUpdate';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import RequireAuth from './components/RequireAuth';
import { api } from './api/http';

function App() {
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const tokens = localStorage.getItem("accessToken");
    if (tokens) {
      useAuthStore.getState().zu_login();
      setLoading(false);
    } else {
      api.get("/members/refresh")
        .then((res) => {
          const { accessToken } = res.data.data;
          localStorage.setItem("accessToken", JSON.stringify({ accessToken }));
          useAuthStore.getState().zu_login();
        })
        .catch(() => {
          localStorage.clear();
          useAuthStore.getState().zu_logout();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <div><b>로그인 상태 확인 중입니다...</b></div>;  // 무조건 넣어야 함
  }
  return (
        <AuthProvider>
      <div className='app-container'>
        <BrowserRouter>
          <Header />
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/productdetail/:id' element={<ProductDetail />} />
              <Route path='/mypage' element={<MyPage />} />
              <Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
              {/* 방명록 */}
              <Route path='/guestBook' element={<GuestBook />} />
              <Route path='/guestBookDetail/:gb_idx' element={<GuestBookDetail />} />
              <Route path='/guestBookInsert' element={<GuestBookInsert />} />
              <Route path='/guestBookUpdate/:gb_idx' element={<GuestBookUpdate />} />
               {/* 게시판1 (BBS) - 로그인 필요 */}
              <Route path='/bbs' element={<RequireAuth><Navigate to="/bbs/1" /></RequireAuth>} />
              <Route path='/bbs/:cPage' element={<RequireAuth><Bbs /></RequireAuth>} />
              <Route path='/bbsDetail/:cPage/:b_idx' element={<RequireAuth><BbsDetail /></RequireAuth>} />
              <Route path='/bbsUpdate/:cPage/:b_idx' element={<RequireAuth><BbsUpdate /></RequireAuth>} />
              <Route path='/bbsWrite' element={<RequireAuth><BbsWrite /></RequireAuth>} />

            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
