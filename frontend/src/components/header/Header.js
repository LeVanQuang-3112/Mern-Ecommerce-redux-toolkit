import React, {useState, useEffect} from 'react';
import Logo from "./images/logo.jpg"
import {Link} from "react-router-dom"
import "./Header.scss"
import { getInfoUser, userSelector, getProducts, userLogout } from '../../store/storeAction';
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router'

export default function Header() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [category, setCategory] = useState("")
    const [search, setSearch] = useState("")
    const [sort] = useState("")
    const [page] =useState(1)
    const [cart, setCart] = useState([])
    const [handleSearch, setHandleSearch] = useState("")
    const login = JSON.parse(localStorage.getItem('login'))
    const userAction = useSelector(userSelector)
    const {userInfo, cartItems} = userAction
    // console.log(userInfo)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
      if(login) {
        dispatch(getInfoUser(login.accesstoken))
      }
      }, [dispatch])
      
      useEffect(() => {
        if(login && login.user.role === 1) {
          setIsAdmin(true)
        }
        if(login) {
          setIsLogged(true)
        }
      }, [login])
      

    useEffect(() => {
      setSearch(handleSearch)
    }, [handleSearch])

    useEffect(() => {
       if(login) {
         setCart(cartItems)
       }
    },[cartItems, setCart])

    const handleSearchSubmit = async(e) => {
          e.preventDefault()
          setHandleSearch('')
          dispatch(getProducts({page, category, sort, search}))
          navigate("/products")
    }
    useEffect(() => {
      dispatch(getProducts({page, category, sort, search}))
         
    },[dispatch, category, search])

    const logoutUser = async() => {
      dispatch(userLogout())
    }

    return (
    <header>
      <div className="container">
        <div className="header__top--container">
          <div className="logo__top">
            <Link to="/" onClick={() => setCategory("")}><img src={Logo} alt="" className="logo__image"/></Link>
          </div>
            <div className="languages">
              <p>Vi-VN | En-US</p>
            </div>
            <div className="navbar__container">
            <label htmlFor="menu__input"><i className="fas fa-bars menu__icon header__icon"></i></label>

            <input type="checkbox" name="" id="menu__input" className="menu__input" />      
            <label htmlFor="menu__input" className="nav__overlay"></label>
              <ul className="navbar__list">
                <li>
                  <div className="nav__header">
                  <div className="flexrow infor__icon--mobile">
                      <i className="far fa-user"></i>
                      <p></p>
                  </div>
                    <div>
                        <label htmlFor="menu__input"><i className="fas fa-times-circle"></i></label>
                    </div>
                  </div>
                </li>
                <li><Link to="/" onClick={() => setCategory("")}>HOME</Link></li>
                <li><Link to="/products">PRODUCTS</Link></li>
                {
                  isAdmin
                  ? <li><Link to="/admin">ADMIN</Link></li>
                  : <li><Link to="/history">HISTORY</Link></li>
                }
                {
                  isLogged
                  ? <li><Link to="/" onClick={logoutUser} style={{display: "flex", alignItems: "center"}}>LOGOUT&nbsp; <i className="fal fa-sign-out"></i></Link></li>
                  : <>
                  <li><Link to="/login">LOGIN</Link></li>
                  <li><Link to="/register">REGISTER</Link></li>
                  </>
                
                }
                
              </ul>
            </div>
        </div>

        <div className="header__bottom--container">
          <div className="logo__bottom">
          <Link to="/" onClick={() => setCategory("")}><img src={Logo} alt="" className="logo__image"/></Link>
          </div>
          <div className="info__icon">
            <Link to="/info"><i className="fas fa-heart header__icon"></i></Link>
          </div>
          <div className="search__header--container">
              <form onSubmit={handleSearchSubmit} className="search__form">
                <input name="" placeholder="Search for products..." className="search__input"
                value={handleSearch} onChange={(e) => setHandleSearch(e.target.value)}/>
                <button type="submit">
                <i className="fas fa-search"></i>&nbsp;
                <p>Search</p>
                </button>
              </form>
          </div>
          {
            isLogged
            ? (
              <>
              {
            isAdmin 
            ? (
              <Link to="/admin">
          <div className="flexrow infor__icon">
            {
              userInfo.avatar !== ""
              ?
              (<img src={userInfo.avatar} alt="avatar" className="avatar__header"/>)
             : (<i className="far fa-user header__icon"></i>)
            }
          <p>{userInfo.name}</p>
          </div>

              </Link>
            ) : (
              <Link to="/history">
          <div className="flexrow infor__icon">
          {
              userInfo.avatar !== ""
              ?
              (<img src={userInfo.avatar} alt="avatar" className="avatar__header"/>)
             : (<i className="far fa-user header__icon"></i>)
            }
          <p>{userInfo.name}</p>
          </div>

              </Link>
            )
          }
          </>
            )
            : (<i className="far fa-user header__icon"></i>)
          }
          <div className="flexrow cart" style={{marginRight: "8px"}}>
            <Link to="/cart">
              <i className="fas fa-shopping-cart header__icon"></i>
            </Link>
          <p>{login ? cart.length : '0'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
