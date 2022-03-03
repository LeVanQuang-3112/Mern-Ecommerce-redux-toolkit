import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Login from './components/mainpage/auth/Login';
import History from './components/mainpage/user/History';
import Register from './components/mainpage/auth/Register';
import { Cart } from './components/mainpage/cart/Cart';
import { Home } from './components/mainpage/home/Home';
import  Admin  from './components/mainpage/admin/Admin';
import { ProductDetail } from './components/mainpage/products/ProductDetail';
import { Products } from './components/mainpage/products/Products';
import ScrollTop  from './components/mainpage/support/ScrollTop';
import NotFound  from './components/mainpage/support/NotFound';
import ScrollToTop  from './components/mainpage/support/ScrollTopPage';
import Footer from './components/footer/Footer';

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const login = JSON.parse(localStorage.getItem('login'))
  useEffect(() => {
    if(login && login.user.role ===1) {
        setIsAdmin(true)
    }
    if(login) {
      setIsLogged(true)
    }
  },[login, setIsAdmin, setIsLogged, isAdmin, isLogged])
  return (
    <div className="App">
          <BrowserRouter>
          <ScrollToTop/>
          <Header/>
      <Routes>
         <Route index element={<Home />} /> 
         <Route path="/products" element={<Products />} /> 
         <Route path="/login" element={isLogged ? <NotFound/> : <Login/>} />
         <Route path="/register" element={isLogged ? <NotFound/> : <Register/>}/>
         <Route path="/products/:id" element={<ProductDetail />} />
         <Route path="/cart" element={<Cart />} />
         <Route path="/admin" element={isAdmin ? <Admin/> : <NotFound/>} />
         <Route path="/history" element={isLogged ? <History/> : <NotFound/>} />
         <Route path="/admin/:id" element={<Admin/>} />

         <Route path="#" index element={<NotFound />} />
      </Routes>
            <ScrollTop/>
            <Footer/>
          </BrowserRouter>
    </div>
  );
}

export default App;
