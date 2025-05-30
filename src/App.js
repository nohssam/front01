import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
                <Route  path="/" element={<Main />}/>
                <Route  path="/login" element={<Login  />}/>
                <Route  path="/signup" element={<Signup />}/>
                <Route  path="/mypage" element={<MyPage />}/>
                <Route  path="/productdetail/:id" element={<ProductDetail />}/>
              </Routes>
            </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
