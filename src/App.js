import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import { useEffect, useState } from 'react';

function App() {
    // 맨처음은 로드인 성공하지 않았음
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     
    // 컴포넌트가 마운트 될때 로그인 상태인지 확인
     useEffect(()=>{
        // localStorage에 token 이 있으면 true(로그인 했다는 증거)
        const token = localStorage.getItem("token")
        setIsLoggedIn(token);
     },[]);

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <div className='main-content'>
            <Routes>
              <Route  path="/" element={<Main />}/>
              <Route  path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />}/>
              <Route  path="/signup" element={<Signup />}/>
              <Route  path="/productdetail/:id" element={<ProductDetail />}/>
            </Routes>
          </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
