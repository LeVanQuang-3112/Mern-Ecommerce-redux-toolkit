import React, { useEffect, useState } from 'react'
import {Button} from "@mui/material"
import {Link} from "react-router-dom"
import "./Products.scss"
import {useDispatch, useSelector} from 'react-redux'
import { addCart, getInfoUser, userSelector} from '../../../store/storeAction';
import Swal from 'sweetalert2';
import axios from 'axios'

export const ProductItem = ({product}) => {
    const dispatch = useDispatch()
    const userAction = useSelector(userSelector)
    const {cartItems} = userAction
    const [cart, setCart] = useState([])

    useEffect(() => {
        setCart(cartItems)
    }, [cart])
    const login = JSON.parse(localStorage.getItem('login'))
    // console.log(cart)

    useEffect(() => {
        if(login) {
            dispatch(getInfoUser(login.accesstoken))
        }
    }, [dispatch])

    const addToCart = async(product) => {
        if(login) {
            if(cart.length === 0) {
                const addCartAction = async() => {
                    const response = await axios.patch(`http://localhost:5000/user/addcart`, {cart: [...cart, {...product, quantity: 1}]}, {
                        headers: {Authorization: login.accesstoken}
                    })
                    console.log(response)
                }
                addCartAction()
                dispatch(addCart({cart: [...cart, product]}))
                Swal.fire("Success", "Added to cart", 'success')
            }
           cartItems.find((item) => {
                if(item._id === product._id) {
                    Swal.fire("Warning", "This product is already in your cart")
                }
                else {
                    const addCartAction = async() => {
                        const response = await axios.patch(`http://localhost:5000/user/addcart`, {cart: [...cart, {...product, quantity: 1}]}, {
                            headers: {Authorization: login.accesstoken}
                        })
                        console.log(response)
                    }
                    addCartAction()
                    dispatch(addCart({cart: [...cart, product]}))
                    Swal.fire("Success", "Added to cart", 'success')
                }
            })
        } 
        else {
            Swal.fire("Error", "You need login", "error")
        }
    }


  return (
    <div className="product__container">
            <Link to={`/products/${product._id}`}>
            <div className="product__image--container">
                <img src={product.images.url} alt={product.title}/>
            </div>
            <div></div>
            <div className="product__content--container">
                <div className="product__content">
                     {
                         product.title.length > 20 
                         ? (<p>{product.title.substring(0, 26)}...</p>)
                         : (<p>{product.title}</p>)
                     }
                     <h3>Price: ${product.price}</h3>
                </div>
            </div>
            </Link>
            <div className="product__btn">
            <Button variant="contained" color="primary" className="addCart__btn"
            onClick={() => addToCart(product)}>Add to cart</Button>
            </div>
        </div>
  )
}
