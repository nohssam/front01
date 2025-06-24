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
import { useEffect } from 'react';

// import GuestBook from './pages/GuestBook';
import GuestBook from './pages/GuestBook';
import GuestBookDetail from './pages/GuestBookDetail';
import GuestBookInsert from './pages/GuestBookInsert';
import GuestBookUpdate from './pages/GuestBookUpdate';
import Bbs from './pages/Bbs';
import Board from './pages/Board';
import BbsDetail from './pages/BbsDetail';
import BbsWrite from './pages/BbsWrite';
import BbsUpdate from './pages/BbsUpdate';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
function App() {

  useEffect(()=>{
    const tokens = localStorage.getItem("tokens");
    if(tokens){
        useAuthStore.getState().zu_login();
    }
  },[]);

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
              <Route path='/oauth2/redirect' element={<OAuth2RedirectHandler/>} />              
              <Route path='/guestbook' element={<GuestBook/>} />              
              <Route path='/guestBookDetail/:gb_idx' element={<GuestBookDetail/>} />              
              <Route path='/guestBookInsert' element={<GuestBookInsert />} />              
              <Route path='/guestBookUpdate/:gb_idx' element={<GuestBookUpdate/>} />              
              <Route path='/bbs' element={<Navigate to="/bbs/1"/>} />              
              <Route path='/bbs/:cPage' element={<Bbs/>} />              
              <Route path='/bbsDetail/:cPage/:b_idx' element={<BbsDetail/>} />              
              <Route path='/bbsUpdate/:cPage/:b_idx' element={<BbsUpdate/>} />              
              <Route path='/bbsWrite' element={<BbsWrite/>} />              
              <Route path='/board' element={<Board/>} />              
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
