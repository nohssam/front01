import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className='app-container'>
      <BrowserRouter>
        <Header />
          <div className='main-content'>
            <Routes>
              <Route  path="/" element={<Main />}/>
              <Route  path="/login" element={<Login />}/>
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
