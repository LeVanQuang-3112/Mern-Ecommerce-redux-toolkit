import { useEffect, useState } from 'react';
import axios from "axios"
import './Cart.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { addCart, getInfoUser, userSelector, decrement, increment } from '../../../store/storeAction';
import {useSelector, useDispatch} from 'react-redux'
import PaypalButton from './PaypalButton';
import Swal from 'sweetalert2'

export const Cart = () => {
    const [total, setTotal] = useState(0)
    const login = JSON.parse(localStorage.getItem('login'))
    
    const userAction = useSelector(userSelector)
    const {cartItems} = userAction
    const [cart, setCart] = useState([])
    const dispatch = useDispatch()
    
    const addToCart = async (cart) => {
        await axios.patch('http://localhost:5000/user/addcart', {cart}, {
            headers: {Authorization: login.accesstoken}
        })
    }

    useEffect(() => {
        if(login) {
            dispatch(getInfoUser(login.accesstoken))
        }
    }, [dispatch, addCart, setCart])
    
    const incrementHandle = (id) => {
        dispatch(increment(id))
        addToCart(cart)
    }
    const decrementHandle = (id) => {
        dispatch(decrement(id))
        addToCart(cart)
    }
    const removeCartItem =(id) => {
        if (window.confirm("Do you want to delete this product?")) {
           const newCart= cart.filter((item) => {
              return item._id !== id
        })
        addToCart(newCart)
        dispatch(addCart(newCart))
    }
}
    const tranSuccess = async(payment) => {
        if(login) {
            const {paymentID, address} = payment
            await axios.post(`http://localhost:5000/api/payment`, {cart, paymentID, address}, {
                headers: {Authorization: login.accesstoken}
            })
            setCart([])
            addToCart([])
            Swal.fire("Success!", "Thanks so much because your payment", "success")
            dispatch(addCart(cart))
        }
    }

console.log(cart)
    useEffect(() => {
        setCart(cartItems)
    }, [cart, cartItems])

    useEffect(() => {
        if(cartItems.length >0) {
            const totalCost = () => {
                let total = cartItems.reduce((prev, item) => {
                    return prev + (item.price * item.quantity)
                }, 0)
                setTotal(total)
            }
            totalCost()
        }
    }, [cartItems])

  return (
    <div className="main">
    <div className="container">
    <div className="cart__container">

        <h1 className="page__header">Cart</h1>
        {
            cartItems && cart.length > 0
            ? (
              <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size="large" aria-label="a dense table">
                      <TableHead>
                          <TableRow>
                              <TableCell className="table__item">Name</TableCell>
                              <TableCell className="table__item" align="left">Image</TableCell>
                              <TableCell className="table__item">Category</TableCell>
                              <TableCell className="table__item">Price</TableCell>
                              <TableCell className="table__item">Quantity</TableCell>
                              <TableCell className="table__item" align="right"></TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                      {cart && cart.map((item) => (
                          <TableRow
                          key={item._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              {
                                  item.title.length > 40
                                  ? (
                                  <TableCell className="table__item" component="th" scope="row">{item.title.substring(0, 40)}...</TableCell>
                                  )
                                  : <TableCell className="table__item" component="th" scope="row">{item.title}</TableCell>
                              }
                          
                          <TableCell className="table__item">
                              <img src={item.images.url} alt={item.title} className="cart__image"/>
                          </TableCell>
                          <TableCell className="table__item">{item.category}</TableCell>
                          <TableCell className="table__item">${item.price}</TableCell>
                          <TableCell className="table__item">
                              <div style={{display: "flex", alignItems: "center"}}>

                              <button className="table__cart--button" onClick={() => decrementHandle(item._id)}>-</button>
                              &nbsp;
                              {item.quantity}
                              &nbsp;
                              <button className="table__cart--button" onClick={() => incrementHandle(item._id)}>+</button>
                              </div>
                              </TableCell>
                          <TableCell className="table__item" align="right">
                              <Button className="cart__remove--btn" variant="contained" color="success" 
                              onClick={() => removeCartItem(item._id)}>Remove</Button>
                          </TableCell>
                          </TableRow>
                      ))}

                      <TableRow>
                          <TableCell className="table__item" colSpan={2}>Total</TableCell>
                          <TableCell className="table__item total__price" align="right"><strong>${Math.round(total*1000)/1000}</strong></TableCell>
                          <TableCell className="table__item" align="right"></TableCell>
                          <TableCell className="table__item" align="right"></TableCell>
                          <TableCell className="table__item" align="right">
                              <PaypalButton total={total} tranSuccess={tranSuccess} className="paypal__button"/>
                          </TableCell>
                      </TableRow>

                      </TableBody>
                  </Table>
                  </TableContainer>
            )
            : (
                     <Grid item xs={12} md={12} lg={12}>
            <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 300
            }}>
                <h2>No Cart Item</h2>
                </Paper>
                </Grid> 
            )
        }
      
    </div>
    </div>
    </div>  
  )
}
